# Food Bridge - Full Stack Web Application

## Overview

Food Bridge is a comprehensive web application designed to connect restaurants with orphanages to reduce food waste and support communities. This platform enables restaurants to list surplus food, allows orphanages to claim available food, and provides administrators with tools to manage the entire system.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Data Flow](#data-flow)
- [User Roles](#user-roles)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### For Restaurants

- **Registration & Authentication**: Secure sign-up and login system
- **Food Listings**: Create and manage listings for surplus food
- **Dashboard**: View all listings, claims, and status updates
- **Status Management**: Update food status (Available, Claimed, Delivered)

### For Orphanages

- **Registration & Authentication**: Secure sign-up and login system
- **Food Discovery**: Browse available food listings
- **Claim Management**: Request food from restaurants
- **Dashboard**: Track claims and delivery status

### For Administrators

- **User Management**: View and manage all registered users
- **Food Monitoring**: Monitor all food listings and claims
- **Analytics**: View system statistics and usage patterns
- **Content Moderation**: Review and manage listings

## Technology Stack

### Frontend

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form validation and handling
- **Zod** - Schema validation
- **Shadcn UI** - Component library
- **Lucide React** - Icon library
- **React Icons** - Additional icons
- **React Toastify** - Toast notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Git** - Version control

## Architecture

### Frontend Architecture

The frontend follows a component-based architecture with the following structure:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── FeatureCard.tsx # Custom feature components
│   ├── Navbar.tsx      # Navigation component
│   └── Footer.tsx      # Footer component
├── pages/              # Page components
│   ├── Login.tsx       # Authentication page
│   ├── Register.tsx    # User registration
│   └── dashboard/      # User dashboards
├── services/           # API service layer
│   └── api.ts          # API endpoints and requests
├── contexts/           # React context providers
│   └── AuthContext.tsx # Authentication state management
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

### Backend Architecture

The backend follows a RESTful API architecture with the following structure:

```
backend/
├── models/             # Mongoose models
│   ├── User.js         # User model
│   ├── UserRole.js     # User role model
│   ├── Restaurant.js   # Restaurant model
│   ├── Orphanage.js    # Orphanage model
│   ├── FoodListing.js  # Food listing model
│   └── Claim.js        # Food claim model
├── routes/             # API route handlers
│   ├── auth.js         # Authentication routes
│   ├── restaurants.js  # Restaurant-specific routes
│   ├── orphanages.js   # Orphanage-specific routes
│   └── admin.js        # Admin routes
├── server.js           # Main server file
└── .env               # Environment variables
```

## Data Flow

### User Registration Flow

1. User fills registration form with role selection
2. Frontend validates input using Zod schema
3. API call sent to `/api/auth/register`
4. Backend validates data and creates user
5. JWT token generated and returned
6. Token stored in localStorage
7. User redirected to appropriate dashboard

### Food Listing Flow

1. Restaurant logs in and accesses dashboard
2. Restaurant fills food listing form
3. Frontend validates input
4. API call sent to `/api/restaurants/listings`
5. Backend creates food listing with restaurant association
6. Listing appears in available food listings
7. Status updates in real-time

### Food Claim Flow

1. Orphanage browses available listings
2. Orphanage selects food and submits claim
3. Frontend validates claim request
4. API call sent to `/api/orphanages/claims`
5. Backend creates claim with orphanage association
6. Restaurant notified of new claim
7. Restaurant updates status to "Claimed"
8. Delivery coordination begins

### Status Update Flow

1. Restaurant updates food status
2. API call sent to status update endpoint
3. Backend updates food listing status
4. Real-time updates reflected in dashboards
5. Notifications sent to relevant parties

## User Roles

### Restaurant Users

**Capabilities:**

- Register with restaurant-specific information
- Create and manage food listings
- View all listings and their status
- Update food status (Available → Claimed → Delivered)
- View claims made on their listings
- Contact orphanages for delivery coordination

**Data Model:**

```javascript
{
  name: String,
  email: String,
  password: String,
  role: 'restaurant',
  restaurantName: String,
  address: String,
  contactNumber: String,
  createdAt: Date
}
```

### Orphanage Users

**Capabilities:**

- Register with orphanage-specific information
- Browse available food listings
- Submit claims for available food
- View claim status and history
- Contact restaurants for delivery coordination
- Track food received

**Data Model:**

```javascript
{
  name: String,
  email: String,
  password: String,
  role: 'orphanage',
  orphanageName: String,
  address: String,
  contactNumber: String,
  capacity: Number,
  createdAt: Date
}
```

### Administrator Users

**Capabilities:**

- View all users and their information
- Monitor all food listings and claims
- Generate system reports and analytics
- Manage user accounts (suspend, delete)
- View system statistics
- Monitor platform activity

**Data Model:**

```javascript
{
  name: String,
  email: String,
  password: String,
  role: 'admin',
  permissions: [String],
  createdAt: Date
}
```

## MongoDB Database Design

### Why MongoDB?

Food Bridge uses MongoDB as its primary database for several strategic reasons:

#### 1. **Flexible Schema Design**

- **NoSQL Flexibility**: MongoDB's document-based structure allows for flexible schemas that can evolve with the application
- **Easy Iteration**: Adding new fields or modifying existing ones doesn't require complex migrations
- **Rapid Development**: Developers can quickly prototype and iterate on features

#### 2. **Scalability**

- **Horizontal Scaling**: MongoDB supports sharding for distributing data across multiple servers
- **High Performance**: Optimized for read-heavy workloads typical in food distribution platforms
- **Cloud Native**: Excellent support for cloud deployments and auto-scaling

#### 3. **Geospatial Capabilities**

- **Location-Based Queries**: Built-in geospatial indexing for finding nearby restaurants/orphanages
- **Distance Calculations**: Efficient queries for finding food within specific radius
- **Map Integration**: Easy integration with mapping services

#### 4. **Real-time Updates**

- **Change Streams**: Real-time notifications when data changes
- **Live Dashboards**: Instant updates to user interfaces
- **WebSocket Integration**: Seamless real-time communication

### Database Collections

#### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: String, // 'restaurant' | 'orphanage' | 'admin'
  restaurantName: String, // Optional
  orphanageName: String,  // Optional
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      type: String, // "Point"
      coordinates: [Number, Number] // [longitude, latitude]
    }
  },
  contactNumber: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
};
```

#### Food Listings Collection

```javascript
{
  _id: ObjectId,
  restaurantId: ObjectId, // Reference to Users collection
  title: String,
  description: String,
  quantity: Number,
  category: String, // 'vegetarian' | 'non-vegetarian' | 'mixed'
  expiryDate: Date,
  pickupInstructions: String,
  status: String, // 'available' | 'claimed' | 'delivered' | 'expired'
  images: [String], // Array of image URLs
  createdAt: Date,
  updatedAt: Date,
  location: {
    type: String, // "Point"
    coordinates: [Number, Number]
  }
}
```

#### Claims Collection

```javascript
{
  _id: ObjectId,
  listingId: ObjectId, // Reference to Food Listings
  orphanageId: ObjectId, // Reference to Users collection
  status: String, // 'pending' | 'approved' | 'rejected' | 'completed'
  requestedQuantity: Number,
  reason: String,
  contactPerson: String,
  contactNumber: String,
  pickupTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Database Relationships

#### 1. **One-to-Many Relationships**

- **User → Food Listings**: One restaurant can have multiple food listings
- **User → Claims**: One orphanage can make multiple claims
- **Food Listing → Claims**: One listing can have multiple claims

#### 2. **Referential Integrity**

- **ObjectId References**: All relationships use MongoDB's ObjectId for efficient joins
- **Population**: Mongoose population used to fetch related data
- **Cascading Updates**: Status changes propagate through related documents

#### 3. **Indexing Strategy**

```javascript
// Compound indexes for common queries
{ restaurantId: 1, status: 1 }           // Restaurant listings by status
{ orphanageId: 1, status: 1 }           // Orphanage claims by status
{ location: "2dsphere" }                // Geospatial queries
{ createdAt: -1 }                       // Recent activity
{ status: 1, expiryDate: 1 }            // Expired listings cleanup
```

### Data Consistency and Validation

#### 1. **Schema Validation**

- **Mongoose Schemas**: Define strict validation rules
- **Custom Validators**: Business logic validation (e.g., quantity limits)
- **Required Fields**: Ensure critical data is always present

#### 2. **Data Integrity**

- **Unique Constraints**: Prevent duplicate users by email
- **Referential Checks**: Validate foreign key relationships
- **Status Transitions**: Enforce valid state changes

#### 3. **Backup and Recovery**

- **Automated Backups**: Regular database snapshots
- **Point-in-Time Recovery**: Restore to specific moments
- **Replica Sets**: High availability and data redundancy

### Performance Optimization

#### 1. **Query Optimization**

- **Indexing**: Strategic indexes for common query patterns
- **Aggregation Pipeline**: Complex data transformations
- **Projection**: Fetch only required fields

#### 2. **Caching Strategy**

- **Application Cache**: Redis for frequently accessed data
- **Query Results**: Cache expensive database operations
- **Static Assets**: CDN for images and media

#### 3. **Connection Management**

- **Connection Pooling**: Efficient database connection reuse
- **Connection Limits**: Prevent database overload
- **Timeout Handling**: Graceful handling of slow queries

## Installation

### Prerequisites

- Node.js (version 18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository:**

```bash
git clone https://github.com/djwebbbbb/food-bridge.git
cd food-bridge/backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Environment setup:**

```bash
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

4. **Start the server:**

```bash
npm start
# or for development with auto-restart
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd ../
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm run dev
```

4. **Open your browser:**
   Visit `http://localhost:5173`

## Usage

### Development Workflow

1. **Start Backend Server:**

```bash
cd backend
npm run dev
```

2. **Start Frontend Development:**

```bash
cd ..
npm run dev
```

3. **Access Application:**

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001/api`

### Environment Variables

#### Backend (.env)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/food-bridge
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
```

#### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "restaurant",
  "restaurantName": "John's Restaurant",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "contactNumber": "+1234567890"
}
```

#### POST /api/auth/login

Login user

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Restaurant Endpoints

#### POST /api/restaurants/listings

Create food listing

```json
{
  "title": "Fresh Vegetables",
  "description": "Organic vegetables, expired in 2 days",
  "quantity": 10,
  "category": "vegetarian",
  "expiryDate": "2024-01-15",
  "pickupInstructions": "Available after 5 PM"
}
```

#### GET /api/restaurants/listings

Get all listings for restaurant

#### PUT /api/restaurants/listings/:id/status

Update listing status

### Orphanage Endpoints

#### GET /api/orphanages/listings

Get available food listings

#### POST /api/orphanages/claims

Create food claim

```json
{
  "listingId": "listing-id",
  "requestedQuantity": 5,
  "reason": "Feeding 20 children",
  "contactPerson": "Jane Doe",
  "contactNumber": "+1234567890",
  "pickupTime": "2024-01-10T14:00:00Z"
}
```

#### GET /api/orphanages/claims

Get orphanage claims

### Admin Endpoints

#### GET /api/admin/users

Get all users

#### GET /api/admin/listings

Get all food listings

#### GET /api/admin/claims

Get all claims

#### GET /api/admin/analytics

Get system analytics

## Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint and Prettier configurations
2. **Type Safety**: Use TypeScript strictly
3. **Testing**: Write tests for new features
4. **Documentation**: Update README for significant changes

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with proper commit messages
3. Run tests and linting
4. Create pull request with description
5. Wait for code review and approval


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support and questions:

- Email: support@foodbridge.com
- Website: [foodbridge.com](https://foodbridge.com)

## Acknowledgments

- MongoDB for excellent database solutions
- React and Node.js communities
- All contributors and testers
