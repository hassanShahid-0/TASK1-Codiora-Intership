const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: [true, 'Please add skill name']
  },
  skillLevel: {
    type: String,
    required: [true, 'Please add skill level'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
