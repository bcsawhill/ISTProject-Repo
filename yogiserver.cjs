const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

const User = require("./models/userModel.cjs");
const Customer = require("./models/customerModel.cjs");
const Waiver = require("./models/waiverModel.cjs");

const app = express();

const MONGODB_URI =
  "mongodb+srv://dmancini1999_db_user:eRifJAmRYwICGs5N@cluster0.uljjn4c.mongodb.net/yogidb?retryWrites=true&w=majority";

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "yogitrack-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// API routes
app.use("/api/instructor", require("./routes/instructorRoutes.cjs"));
app.use("/api/package", require("./routes/packageRoutes.cjs"));
app.use("/api/customer", require("./routes/customerRoutes.cjs"));
app.use("/api/class", require("./routes/classRoutes.cjs"));
app.use("/api/classRecord", require("./routes/classRecordRoutes.cjs"));

// Helpers
async function requireLogin(req, res, next) {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const currentUser = await User.findById(req.session.user.id);

    if (!currentUser || !currentUser.isActive) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Account inactive" });
    }

    req.session.user.username = currentUser.username;
    req.session.user.role = currentUser.role;
    req.session.user.customerId = currentUser.customerId;

    next();
  } catch (err) {
    console.error("requireLogin error:", err);
    return res.status(500).json({ error: "Authentication check failed" });
  }
}

async function requireAdmin(req, res, next) {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const currentUser = await User.findById(req.session.user.id);

    if (!currentUser || !currentUser.isActive) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Account inactive" });
    }

    if (currentUser.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    req.session.user.username = currentUser.username;
    req.session.user.role = currentUser.role;
    req.session.user.customerId = currentUser.customerId;

    next();
  } catch (err) {
    console.error("requireAdmin error:", err);
    return res.status(500).json({ error: "Admin check failed" });
  }
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

async function getNextCustomerId() {
  const idRes = await Customer.find({}).sort({ customerId: -1 }).limit(1);

  let maxNumber = 1;
  if (idRes.length > 0) {
    const lastId = idRes[0].customerId;
    const match = lastId.match(/\d+$/);
    if (match) {
      maxNumber = parseInt(match[0], 10) + 1;
    }
  }

  return `Y${String(maxNumber).padStart(3, "0")}`;
}

async function findUserByUsernameEmailPhone(username, email, phone) {
  const normalizedUsername = String(username || "").trim();
  const normalizedEmailValue = normalizeEmail(email);
  const normalizedPhoneValue = normalizePhone(phone);

  if (!normalizedUsername || !normalizedEmailValue || !normalizedPhoneValue) {
    return null;
  }

  const user = await User.findOne({ username: normalizedUsername });

  if (!user || !user.customerId) {
    return null;
  }

  const customer = await Customer.findOne({ customerId: user.customerId });

  if (!customer) {
    return null;
  }

  const emailMatches = normalizeEmail(customer.email) === normalizedEmailValue;
  const phoneMatches = normalizePhone(customer.phone) === normalizedPhoneValue;

  if (!emailMatches || !phoneMatches) {
    return null;
  }

  return { user, customer };
}

// Auth routes
app.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      address,
    } = req.body;

    if (!username || !password || !firstName || !lastName || !email || !phone) {
      return res.redirect("/htmls/register.html?error=missing_fields");
    }

    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.redirect("/htmls/register.html?error=username_taken");
    }

    const existingCustomerEmail = await Customer.findOne({ email: email.trim() });
    if (existingCustomerEmail) {
      return res.redirect("/htmls/register.html?error=email_taken");
    }

    const customerId = await getNextCustomerId();
    const passwordHash = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      customerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: (address || "").trim(),
      classBalance: 0,
      senior: false,
      unlimitedActive: false,
      unlimitedExpires: null,
    });

    await newCustomer.save();

    const newUser = new User({
      username: username.trim(),
      passwordHash,
      role: "member",
      customerId,
      isActive: true,
      deactivatedAt: null,
    });

    await newUser.save();

    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      customerId: newUser.customerId,
    };

    return res.redirect("/htmls/member-dashboard.html");
  } catch (err) {
    console.error("Register error full:", err);
    return res.redirect("/htmls/register.html?error=register_failed");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.redirect("/index.html?error=missing_fields");
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.redirect("/index.html?error=login_failed");
    }

    if (!user.isActive) {
      return res.redirect("/index.html?error=account_inactive");
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.redirect("/index.html?error=login_failed");
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
      customerId: user.customerId,
    };

    if (["admin", "staff", "instructor"].includes(user.role)) {
      return res.redirect("/htmls/dashboard.html");
    }

    return res.redirect("/htmls/member-dashboard.html");
  } catch (err) {
    console.error("Login error:", err);
    return res.redirect("/index.html?error=login_failed");
  }
});

// Session/user info
app.get("/check-users", async (req, res) => {
  try {
    const users = await User.find({}, "username role customerId isActive deactivatedAt");
    res.json(users);
  } catch (err) {
    console.error("Check users error:", err);
    res.status(500).send("Error checking users.");
  }
});

app.get("/api/me", requireLogin, (req, res) => {
  res.json(req.session.user);
});

// Profile routes
app.get("/api/profile", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(
      req.session.user.id,
      "username role customerId isActive deactivatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let customer = null;

    if (user.customerId) {
      customer = await Customer.findOne(
        { customerId: user.customerId },
        "customerId firstName lastName email phone address classBalance senior packageExpires unlimitedActive unlimitedExpires"
      );
    }

    res.json({ user, customer });
  } catch (err) {
    console.error("Load profile error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

app.put("/api/profile/update", requireLogin, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        message: "First name, last name, email, and phone are required",
      });
    }

    const user = await User.findById(req.session.user.id);

    if (!user || !user.customerId) {
      return res.status(404).json({
        message: "No editable customer profile is linked to this account",
      });
    }

    const existingCustomerWithEmail = await Customer.findOne({
      email: email.trim(),
      customerId: { $ne: user.customerId },
    });

    if (existingCustomerWithEmail) {
      return res.status(400).json({
        message: "That email is already in use by another account",
      });
    }

    const customer = await Customer.findOne({ customerId: user.customerId });

    if (!customer) {
      return res.status(404).json({
        message: "Customer profile not found",
      });
    }

    customer.firstName = firstName.trim();
    customer.lastName = lastName.trim();
    customer.email = email.trim();
    customer.phone = phone.trim();
    customer.address = (address || "").trim();

    await customer.save();

    res.json({
      message: "Profile updated successfully",
      customer,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

app.post("/api/profile/change-password", requireLogin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!matches) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

// Forgot password route
app.post("/api/forgot-password/reset", async (req, res) => {
  try {
    const { username, email, phone, newPassword, confirmPassword } = req.body;

    if (!username || !email || !phone || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const match = await findUserByUsernameEmailPhone(username, email, phone);

    if (!match) {
      return res.status(404).json({
        message: "The username, email, or phone number did not match our records",
      });
    }

    if (!match.user.isActive) {
      return res.status(403).json({
        message: "This account is inactive. Please contact an administrator.",
      });
    }

    match.user.passwordHash = await bcrypt.hash(newPassword, 10);
    await match.user.save();

    res.json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    console.error("Forgot password reset error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

// Admin role routes
app.get("/api/user-role/:customerId", requireAdmin, async (req, res) => {
  try {
    const user = await User.findOne(
      { customerId: req.params.customerId },
      "username role customerId isActive deactivatedAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found for this customer" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user role error:", err);
    res.status(500).json({ error: "Error loading user role" });
  }
});

app.post("/api/user-role/:customerId", requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "staff", "instructor", "member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findOne({ customerId: req.params.customerId });

    if (!user) {
      return res.status(404).json({ error: "User not found for this customer" });
    }

    user.role = role;
    await user.save();

    if (req.session.user && String(req.session.user.id) === String(user._id)) {
      req.session.user.role = role;
    }

    res.json({ message: "Role updated successfully", role: user.role });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ error: "Error updating role" });
  }
});

// Account status routes
app.get("/api/account-status/:customerId", requireLogin, async (req, res) => {
  try {
    const user = await User.findOne(
      { customerId: req.params.customerId },
      "username role customerId isActive deactivatedAt"
    );

    if (!user) {
      return res.json({
        hasLogin: false,
        customerId: req.params.customerId,
      });
    }

    res.json({
      hasLogin: true,
      customerId: user.customerId,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      deactivatedAt: user.deactivatedAt,
    });
  } catch (err) {
    console.error("Get account status error:", err);
    res.status(500).json({ message: "Failed to load account status" });
  }
});

app.post("/api/account-status/:customerId", requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be true or false" });
    }

    const user = await User.findOne({ customerId: req.params.customerId });

    if (!user) {
      return res.status(404).json({ message: "User not found for this customer" });
    }

    if (!isActive && String(user._id) === String(req.session.user.id)) {
      return res.status(400).json({
        message: "You cannot deactivate your own account while logged in",
      });
    }

    if (!isActive && user.role === "admin") {
      const activeAdminCount = await User.countDocuments({
        role: "admin",
        isActive: true,
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          message: "You cannot deactivate the last active admin account",
        });
      }
    }

    user.isActive = isActive;
    user.deactivatedAt = isActive ? null : new Date();

    await user.save();

    res.json({
      message: isActive ? "Account reactivated successfully" : "Account deactivated successfully",
      user: {
        customerId: user.customerId,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        deactivatedAt: user.deactivatedAt,
      },
    });
  } catch (err) {
    console.error("Update account status error:", err);
    res.status(500).json({ message: "Failed to update account status" });
  }
});

// Waiver routes
app.get("/api/waiver", requireLogin, async (req, res) => {
  try {
    const waiver = await Waiver.findOne({ customerId: req.session.user.customerId });

    if (!waiver) {
      return res.status(404).json({ message: "No waiver found" });
    }

    res.json({
      customerId: waiver.customerId,
      fullName: waiver.fullName,
      agreed: waiver.agreed,
      signedAt: waiver.signedAt,
    });
  } catch (err) {
    console.error("Get waiver error:", err);
    res.status(500).json({ message: "Failed to load waiver" });
  }
});

app.post("/api/waiver", requireLogin, async (req, res) => {
  try {
    const { fullName, agreed } = req.body;

    if (!fullName || agreed !== true) {
      return res.status(400).json({ message: "Full name and agreement are required" });
    }

    const existingWaiver = await Waiver.findOne({
      customerId: req.session.user.customerId,
    });

    if (existingWaiver) {
      return res.status(409).json({ message: "Waiver already completed" });
    }

    const waiver = new Waiver({
      customerId: req.session.user.customerId,
      fullName: fullName.trim(),
      agreed: true,
      signedAt: new Date(),
    });

    await waiver.save();

    res.status(201).json({
      message: "Waiver saved successfully",
      waiver: {
        customerId: waiver.customerId,
        fullName: waiver.fullName,
        agreed: waiver.agreed,
        signedAt: waiver.signedAt,
      },
    });
  } catch (err) {
    console.error("Save waiver error:", err);
    res.status(500).json({ message: "Failed to save waiver" });
  }
});

app.get("/api/waiver-status/:customerId", requireLogin, async (req, res) => {
  try {
    const waiver = await Waiver.findOne({ customerId: req.params.customerId });

    if (!waiver) {
      return res.json({
        customerId: req.params.customerId,
        completed: false
      });
    }

    res.json({
      customerId: waiver.customerId,
      completed: true,
      signedAt: waiver.signedAt,
      fullName: waiver.fullName
    });
  } catch (err) {
    console.error("Get waiver status error:", err);
    res.status(500).json({ message: "Failed to load waiver status" });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
  console.log(`Open http://localhost:${PORT}/index.html in your browser to view the app.`);
});