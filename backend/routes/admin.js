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
router.patch('/restaurants/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Restaurant.findByIdAndUpdate(id, { isVerified: true });
    res.json({ message: 'Restaurant approved successfully' });
  } catch (error) {
    console.error('Error approving restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/orphanages/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Orphanage.findByIdAndUpdate(id, { isVerified: true });
    res.json({ message: 'Orphanage approved successfully' });
  } catch (error) {
    console.error('Error approving orphanage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject entity
router.patch('/restaurants/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Restaurant.findByIdAndUpdate(id, { isActive: false });
    res.json({ message: 'Restaurant rejected' });
  } catch (error) {
    console.error('Error rejecting restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/orphanages/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Orphanage.findByIdAndUpdate(id, { isActive: false });
    res.json({ message: 'Orphanage rejected' });
  } catch (error) {
    console.error('Error rejecting orphanage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;