const Project = require('../models/Project');

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
    description,
    technologiesUsed,
    githubLink,
    liveDemoLink,
  } = req.body;

  try {
    if (!projectTitle) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const project = new Project({
      user: req.user.id,
      projectTitle,
      description: description || '',
      technologiesUsed: technologiesUsed || '',
      githubLink: githubLink || '',
      liveDemoLink: liveDemoLink || '',
    });

    await project.save();
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

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        projectTitle,
        description: description || '',
        technologiesUsed: technologiesUsed || '',
        githubLink: githubLink || '',
        liveDemoLink: liveDemoLink || '',
      },
      { new: true, runValidators: true }
    );

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

    await project.deleteOne();

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
