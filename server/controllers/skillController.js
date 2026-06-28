const Skill = require('../models/Skill');
const Activity = require('../models/Activity');

// @desc    Get all user's skills
// @route   GET /api/skills
// @access  Private
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new skill
// @route   POST /api/skills
// @access  Private
const addSkill = async (req, res) => {
  const { skillName, skillLevel } = req.body;

  try {
    if (!skillName || !skillLevel) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const skill = new Skill({
      user: req.user.id,
      skillName,
      skillLevel,
    });

    await skill.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Added skill: "${skillName}" (${skillLevel})`
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
  const { skillName, skillLevel } = req.body;

  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { skillName, skillLevel },
      { new: true, runValidators: true }
    );

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Updated skill: "${skillName}"`
    });

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const skillName = skill.skillName;
    await skill.deleteOne();

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Deleted skill: "${skillName}"`
    });

    res.status(200).json({ message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};
