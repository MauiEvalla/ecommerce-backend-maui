import Subcategory from '../models/subcategory.model.js';

// Create a new Subcategory
export const addSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const newSubcategory = new Subcategory({ name, categoryId });
    const savedSubcategory = await newSubcategory.save();

    res.status(201).json({ message: "Subcategory added successfully", subcategory: savedSubcategory });
  } catch (error) {
    res.status(400).json({ message: "Error adding subcategory", error });
  }
};

// Get all Subcategories
export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('categoryId');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error });
  }
};

// Get Subcategory by ID
export const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate('categoryId');
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(404).json({ message: "Subcategory not found", error });
  }
};

// Delete Subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting subcategory", error });
  }
};

