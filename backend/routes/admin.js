const express = require('express');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');
const Orphanage = require('../models/Orphanage');
const FoodListing = require('../models/FoodListing');
const Claim = require('../models/Claim');
const UserRole = require('../models/UserRole');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    // Verify user has admin role
    const userRole = await UserRole.findOne({ userId: decoded.userId });
    if (!userRole || userRole.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get admin stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      totalRestaurants: await Restaurant.countDocuments(),
      totalOrphanages: await Orphanage.countDocuments(),
      activeListings: await FoodListing.countDocuments({ status: 'available' }),
      totalClaims: await Claim.countDocuments()
    };

    res.json({ data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending approvals
router.get('/pending-approvals', authenticateToken, async (req, res) => {
  try {
    const pendingRestaurants = await Restaurant.find({ isVerified: false })
      .populate('userId', 'email fullName')
      .limit(5);

    const pendingOrphanages = await Orphanage.find({ isVerified: false })
      .populate('userId', 'email fullName')
      .limit(5);

    const combined = [
      ...pendingRestaurants.map(r => ({
        id: r._id,
        name: r.name,
        type: 'restaurant',
        created_at: r.createdAt
      })),
      ...pendingOrphanages.map(o => ({
        id: o._id,
        name: o.name,
        type: 'orphanage',
        created_at: o.createdAt
      }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ data: combined });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve entity
router.post('/approve/:id/:type', authenticateToken, async (req, res) => {
  try {
    const { id, type } = req.params;

    if (type === 'restaurant') {
      await Restaurant.findByIdAndUpdate(id, { isVerified: true });
    } else if (type === 'orphanage') {
      await Orphanage.findByIdAndUpdate(id, { isVerified: true });
    } else {
      return res.status(400).json({ error: 'Invalid entity type' });
    }

    res.json({ message: `${type} approved successfully` });
  } catch (error) {
    console.error('Error approving entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject entity
router.post('/reject/:id/:type', authenticateToken, async (req, res) => {
  try {
    const { id, type } = req.params;

    if (type === 'restaurant') {
      await Restaurant.findByIdAndUpdate(id, { isActive: false });
    } else if (type === 'orphanage') {
      await Orphanage.findByIdAndUpdate(id, { isActive: false });
    } else {
      return res.status(400).json({ error: 'Invalid entity type' });
    }

    res.json({ message: `${type} rejected` });
  } catch (error) {
    console.error('Error rejecting entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;