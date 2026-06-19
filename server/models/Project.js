const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectTitle: {
    type: String,
    required: [true, 'Please add project title']
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  description: {
    type: String,
    default: ''
  },
  technologiesUsed: {
    type: String,
    default: ''
  },
  githubLink: {
    type: String,
    default: ''
  },
  liveDemoLink: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
