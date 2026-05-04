import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  store: {
    type: String,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  color: {
    type: String
  },
  stock: {
    type: Number,
    default: 0
  },
  floor: {
    type: Number
  },
  x: {
    type: Number
  },
  y: {
    type: Number
  }
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;