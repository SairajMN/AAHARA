const express = require('express');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');
const FoodListing = require('../models/FoodListing');
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
    
    // Verify user has restaurant role
    const userRole = await UserRole.findOne({ userId: decoded.userId });
    if (!userRole || userRole.role !== 'restaurant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get restaurant profile
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ userId: req.params.userId });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ data: restaurant });
  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get food listings for restaurant
router.get('/listings/:restaurantId', authenticateToken, async (req, res) => {
  try {
    const listings = await FoodListing.find({ restaurantId: req.params.restaurantId })
      .sort({ createdAt: -1 });
    
    res.json({ data: listings });
  } catch (error) {
    console.error('Error fetching food listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create food listing
router.post('/listings', authenticateToken, async (req, res) => {
  try {
    const { title, description, foodType, quantity, expiresAt } = req.body;

    const listing = new FoodListing({
      restaurantId: req.restaurantId,
      title,
      description,
      foodType,
      quantity,
      expiresAt
    });

    await listing.save();
    res.status(201).json({ data: listing });
  } catch (error) {
    console.error('Error creating food listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update food listing
router.put('/listings/:listingId', authenticateToken, async (req, res) => {
  try {
    const { title, description, foodType, quantity, expiresAt, status } = req.body;

    const listing = await FoodListing.findByIdAndUpdate(
      req.params.listingId,
      {
        title,
        description,
        foodType,
        quantity,
        expiresAt,
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: 'Food listing not found' });
    }

    res.json({ data: listing });
  } catch (error) {
    console.error('Error updating food listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete food listing
router.delete('/listings/:listingId', authenticateToken, async (req, res) => {
  try {
    const listing = await FoodListing.findByIdAndDelete(req.params.listingId);
    
    if (!listing) {
      return res.status(404).json({ error: 'Food listing not found' });
    }

    res.json({ message: 'Food listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting food listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;