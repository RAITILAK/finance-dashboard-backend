import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany();
await Transaction.deleteMany();

const password = await bcrypt.hash("password123", 10);

const [admin, analyst, viewer] = await User.insertMany([
  { name: "Admin User", email: "admin@demo.com", password, role: "admin" },
  {
    name: "Analyst User",
    email: "analyst@demo.com",
    password,
    role: "analyst",
  },
  { name: "Viewer User", email: "viewer@demo.com", password, role: "viewer" },
]);

const categories = [
  "Salary",
  "Rent",
  "Marketing",
  "Sales",
  "Utilities",
  "Travel",
  "Software",
];
const transactions = [];

for (let i = 0; i < 40; i++) {
  transactions.push({
    amount: Math.floor(Math.random() * 9000) + 500,
    type: i % 3 === 0 ? "expense" : "income",
    category: categories[Math.floor(Math.random() * categories.length)],
    date: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ),
    notes: `Auto-generated entry ${i + 1}`,
    createdBy: admin._id,
  });
}

await Transaction.insertMany(transactions);
console.log("✅ Seeded: 3 users + 40 transactions");
console.log("👤 admin@demo.com / password123");
console.log("👤 analyst@demo.com / password123");
console.log("👤 viewer@demo.com / password123");
process.exit();
