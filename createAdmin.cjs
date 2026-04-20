const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userModel.cjs");

const MONGODB_URI =
  "mongodb+srv://dmancini1999_db_user:eRifJAmRYwICGs5N@cluster0.uljjn4c.mongodb.net/yogidb?retryWrites=true&w=majority";

async function createadmin() {
  try {
    console.log("Starting admin creation...");

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const username = "admin1";
    const password = "admin123";

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log("admin1 already exists");
      await mongoose.connection.close();
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      passwordHash,
      role: "admin",
      customerId: null,
    });

    console.log("admin1 created successfully");
    console.log("Username: admin1");
    console.log("Password: admin123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createadmin();