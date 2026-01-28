const express = require('express');
const jwt = require('jsonwebtoken');
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
    
    // Verify user has orphanage role
    const userRole = await UserRole.findOne({ userId: decoded.userId });
    if (!userRole || userRole.role !== 'orphanage') {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get orphanage profile
router.get('/profile/:userId', authenticateToken, async (req, res) => {
  try {
    const orphanage = await Orphanage.findOne({ userId: req.params.userId });
    if (!orphanage) {
      return res.status(404).json({ error: 'Orphanage not found' });
    }

    res.json({ data: orphanage });
  } catch (error) {
    console.error('Error fetching orphanage profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available food listings
router.get('/listings', authenticateToken, async (req, res) => {
  try {
    const listings = await FoodListing.find({ status: 'available' })
      .populate('restaurantId', 'name address city')
      .sort({ expiresAt: 1 })
      .limit(10);
    
    res.json({ data: listings });
  } catch (error) {
    console.error('Error fetching available listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim food listing
router.post('/claims', authenticateToken, async (req, res) => {
  try {
    const { foodListingId } = req.body;

    // Get orphanage
    const orphanage = await Orphanage.findOne({ userId: req.userId });
    if (!orphanage) {
      return res.status(404).json({ error: 'Orphanage not found' });
    }

    // Check if listing exists and is available
    const listing = await FoodListing.findById(foodListingId);
    if (!listing || listing.status !== 'available') {
      return res.status(404).json({ error: 'Food listing not found or not available' });
    }

    // Create claim
    const claim = new Claim({
      foodListingId,
      orphanageId: orphanage._id
    });

    await claim.save();

    // Update listing status
    await FoodListing.findByIdAndUpdate(foodListingId, { status: 'claimed' });

    res.status(201).json({ data: claim });
  } catch (error) {
    console.error('Error claiming food listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orphanage claims
router.get('/claims/:orphanageId', authenticateToken, async (req, res) => {
  try {
    const claims = await Claim.find({ orphanageId: req.params.orphanageId })
      .populate('foodListingId', 'title quantity expiresAt')
      .sort({ createdAt: -1 });
    
    res.json({ data: claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;