const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userModel.cjs");

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

app.use("/api/instructor", require("./routes/instructorRoutes.cjs"));
app.use("/api/package", require("./routes/packageRoutes.cjs"));
app.use("/api/customer", require("./routes/customerRoutes.cjs"));
app.use("/api/class", require("./routes/classRoutes.cjs"));
app.use("/api/classRecord", require("./routes/classRecordRoutes.cjs"));

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.redirect("/index.html?error=missing_fields");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.redirect("/index.html?error=username_taken");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const memberCount = await User.countDocuments({ role: "member" });
    const customerId = `Y${String(memberCount + 1).padStart(3, "0")}`;

    const newUser = new User({
      username,
      passwordHash,
      role: "member",
      customerId,
    });

    await newUser.save();
    return res.redirect("/htmls/dashboard.html");
  } catch (err) {
    console.error("Register error:", err);
    return res.redirect("/index.html?error=register_failed");
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

    return res.redirect("/htmls/dashboard.html");
  } catch (err) {
    console.error("Login error:", err);
    return res.redirect("/index.html?error=login_failed");
  }
});

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

// Start the web server
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
  console.log(`Open http://localhost:${PORT}/index.html in your browser to view the app.`);
});