const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/saas-pro");

// USER MODEL
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String, // user / admin
  plan: String
});
const User = mongoose.model("User", UserSchema);

// PLAN MODEL
const PlanSchema = new mongoose.Schema({
  name: String,
  price: Number
});
const Plan = mongoose.model("Plan", PlanSchema);


// 🔐 REGISTER
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "User registered" });
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) return res.json({ message: "Invalid" });

  res.json(user);
});

// 📦 GET PLANS
app.get("/plans", async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
});

// 👑 ADD PLAN (ADMIN)
app.post("/plans", async (req, res) => {
  const plan = new Plan(req.body);
  await plan.save();
  res.json(plan);
});

// 💳 BUY PLAN
app.post("/buy", async (req, res) => {
  const { username, plan } = req.body;
  const user = await User.findOne({ username });

  user.plan = plan;
  await user.save();

  res.json({ message: "Plan purchased" });
});

// 👑 GET USERS (ADMIN)
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});