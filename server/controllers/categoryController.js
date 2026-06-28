const Category = require('../models/Category');
const Activity = require('../models/Activity');

// @desc    Get all user's categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new category
// @route   POST /api/categories
// @access  Private
const addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({ user: req.user.id, name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      user: req.user.id,
      name
    });

    await category.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Created new project category: "${name}"`
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Check if name already taken by another category for this user
    const duplicate = await Category.findOne({
      user: req.user.id,
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    if (duplicate) {
      return res.status(400).json({ message: 'Another category with this name already exists' });
    }

    const oldName = category.name;
    category.name = name;
    await category.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Renamed category from "${oldName}" to "${name}"`
    });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const categoryName = category.name;
    await category.deleteOne();

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Deleted category: "${categoryName}"`
    });

    res.status(200).json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
};
