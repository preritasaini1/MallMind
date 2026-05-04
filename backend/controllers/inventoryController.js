import Inventory from "../models/Inventory.js";
import { searchInventory } from "../services/inventoryService.js";


// GET inventory search
export async function getInventory(req, res) {
  try {
    const { product, color, budget } = req.query;

    const results = await searchInventory(product, color, budget);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching inventory" });
  }
}


// POST add new inventory item
export async function addInventory(req, res) {
  try {
    const newItem = new Inventory(req.body);

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding inventory item" });
  }
}