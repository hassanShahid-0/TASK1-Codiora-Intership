const Portfolio = require('../models/Portfolio');

// @desc    Get current user's portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or Update user's portfolio
// @route   POST /api/portfolio
// @access  Private
const createOrUpdatePortfolio = async (req, res) => {
  const {
    fullName,
    aboutMe,
    email,
    phoneNumber,
    location,
    linkedinUrl,
    githubUrl,
  } = req.body;

  try {
    let profilePicture = '';

    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
    }

    let portfolio = await Portfolio.findOne({ user: req.user.id });

    const portfolioFields = {
      user: req.user.id,
      fullName: fullName || req.user.name,
      aboutMe: aboutMe || '',
      email: email || '',
      phoneNumber: phoneNumber || '',
      location: location || '',
      linkedinUrl: linkedinUrl || '',
      githubUrl: githubUrl || '',
    };

    if (profilePicture) {
      portfolioFields.profilePicture = profilePicture;
    }

    if (portfolio) {
      portfolio = await Portfolio.findOneAndUpdate(
        { user: req.user.id },
        { $set: portfolioFields },
        { new: true }
      );
      return res.status(200).json(portfolio);
    }

    portfolio = new Portfolio(portfolioFields);
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPortfolio,
  createOrUpdatePortfolio,
};
