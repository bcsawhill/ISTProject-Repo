const mongoose = require("mongoose");

const uri = process.env.MONGO_URI || "mongodb://localhost/yogidb";
// const uri = "mongodb+srv://dmancini1999_db_user:eRifJAmRYwICGs5N@cluster0.uljjn4c.mongodb.net/yogidb?retryWrites=true&w=majority";

mongoose.connect(uri)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
});

module.exports =  mongoose;