const Project = require('../models/Project');
const Activity = require('../models/Activity');

// @desc    Get all user's projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new project
// @route   POST /api/projects
// @access  Private
const addProject = async (req, res) => {
  const {
    projectTitle,
    category,
    description,
    technologiesUsed,
    githubLink,
    liveDemoLink,
  } = req.body;

  try {
    if (!projectTitle) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    let projectImage = '';
    if (req.file) {
      projectImage = `/uploads/${req.file.filename}`;
    }

    const project = new Project({
      user: req.user.id,
      projectTitle,
      category: category || 'Uncategorized',
      projectImage,
      description: description || '',
      technologiesUsed: technologiesUsed || '',
      githubLink: githubLink || '',
      liveDemoLink: liveDemoLink || '',
    });

    await project.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Added project: "${projectTitle}"`
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  const {
    projectTitle,
    category,
    description,
    technologiesUsed,
    githubLink,
    liveDemoLink,
  } = req.body;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    let projectImage = project.projectImage;
    if (req.file) {
      projectImage = `/uploads/${req.file.filename}`;
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        projectTitle,
        category: category || 'Uncategorized',
        projectImage,
        description: description || '',
        technologiesUsed: technologiesUsed || '',
        githubLink: githubLink || '',
        liveDemoLink: liveDemoLink || '',
      },
      { new: true, runValidators: true }
    );

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Updated project: "${projectTitle}"`
    });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const projectTitle = project.projectTitle;
    await project.deleteOne();

    // Log activity
    await Activity.create({
      user: req.user.id,
      description: `Deleted project: "${projectTitle}"`
    });

    res.status(200).json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};
