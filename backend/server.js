const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.log('MongoDB Connection Error:', err);
  });

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("MongoDB Connected"))
//     .catch(err => console.log(err));

// User Model
const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model("User", UserSchema);

// Routes
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post("/users", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json(user);
});

app.put("/users/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

app.delete("/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));

// app.get("/check-db-connection", async (req, res) => {
//     try {
//         // Check if MongoDB connection is alive
//         await mongoose.connection.db.command({ ping: 1 });
//         res.status(200).send("Database connection is good!");
//     } catch (err) {
//         res.status(500).send(`Database connection failed: ${err.message}`);
//     }
// });



