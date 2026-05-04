import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import inventoryRoutes from "./routes/inventoryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
})
  .then(() => console.log("✅ MongoDB Connected for Inventory API"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err.message));

app.use("/api/inventory", inventoryRoutes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Inventory API running on port ${PORT}`);
});