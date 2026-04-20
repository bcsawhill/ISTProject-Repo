const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userModel.cjs");
const session = require("express-session");
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

// Serve static files from the public dir
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

app.use("/api/instructor", require("./routes/instructorRoutes.cjs"));
app.use("/api/package", require("./routes/packageRoutes.cjs"));
app.use("/api/customer", require("./routes/customerRoutes.cjs"));
app.use("/api/class", require("./routes/classRoutes.cjs"));
app.use("/api/classRecord", require("./routes/classRecordRoutes.cjs"));

app.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      address
    } = req.body;

    if (!username || !password || !firstName || !lastName || !email || !phone) {
      return res.redirect("/htmls/register.html?error=missing_fields");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.redirect("/htmls/register.html?error=username_taken");
    }

    const existingCustomerEmail = await Customer.findOne({ email });
    if (existingCustomerEmail) {
      return res.redirect("/htmls/register.html?error=email_taken");
    }

    const idRes = await Customer.find({})
      .sort({ customerId: -1 })
      .limit(1);

    let maxNumber = 1;
    if (idRes.length > 0) {
      const lastId = idRes[0].customerId;
      const match = lastId.match(/\d+$/);
      if (match) {
        maxNumber = parseInt(match[0], 10) + 1;
      }
    }

    const customerId = `Y${String(maxNumber).padStart(3, "0")}`;
    const passwordHash = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      customerId,
      firstName,
      lastName,
      email,
      phone,
      address: address || "",
      classBalance: 0,
      senior: false,
      unlimitedActive: false,
      unlimitedExpires: null
    });

    await newCustomer.save();

    const newUser = new User({
      username,
      passwordHash,
      role: "member",
      customerId
    });

    await newUser.save();

    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      customerId: newUser.customerId
    };

    return res.redirect("/htmls/dashboard.html");
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

    const user = await User.findOne({ username });

    if (!user) {
      return res.redirect("/index.html?error=login_failed");
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

    if (user.role === "admin" || user.role === "staff" || user.role === "instructor") {
      return res.redirect("/htmls/dashboard.html");
    }

    return res.redirect("/htmls/member-dashboard.html");
  } catch (err) {
    console.error("Login error:", err);
    return res.redirect("/index.html?error=login_failed");
  }
});


function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  if (req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }

  next();
}

// Check all users and roles
app.get("/check-users", async (req, res) => {
  try {
    const users = await User.find({}, "username role customerId");
    res.json(users);
  } catch (err) {
    console.error("Check users error:", err);
    res.status(500).send("Error checking users.");
  }
});

app.get("/api/me", requireLogin, (req, res) => {
  res.json(req.session.user);
});

app.get("/api/user-role/:customerId", requireAdmin, async (req, res) => {
  try {
    const user = await User.findOne(
      { customerId: req.params.customerId },
      "username role customerId"
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
      signedAt: waiver.signedAt
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
      customerId: req.session.user.customerId
    });

    if (existingWaiver) {
      return res.status(409).json({ message: "Waiver already completed" });
    }

    const waiver = new Waiver({
      customerId: req.session.user.customerId,
      fullName: fullName.trim(),
      agreed: true,
      signedAt: new Date()
    });

    await waiver.save();

    res.status(201).json({
      message: "Waiver saved successfully",
      waiver: {
        customerId: waiver.customerId,
        fullName: waiver.fullName,
        agreed: waiver.agreed,
        signedAt: waiver.signedAt
      }
    });
  } catch (err) {
    console.error("Save waiver error:", err);
    res.status(500).json({ message: "Failed to save waiver" });
  }
});

// Start the web server
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
  console.log(`Open http://localhost:${PORT}/index.html in your browser to view the app.`);
});
