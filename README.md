# eCommerce Checkout Flow

A 3-page eCommerce checkout simulation with React frontend, Express backend, and MongoDB.

## Features

- Product listing page
- Checkout form with validation
- Order processing with 3 transaction outcomes
- Email notifications via Mailtrap
- MongoDB data persistence

## Tech Stack

- Frontend: React, React Router
- Backend: Express, Node.js
- Database: MongoDB
- Email: Mailtrap (sandbox)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```


## Create .env file in server/

   ```bash
   MONGO_URI=mongodb://localhost:27017/ecommerce-checkout
   MAILTRAP_USER=your_username
   MAILTRAP_PASS=your_password
   ```
## Create .env file in client/

   ```bash
   REACT_APP_BACKEND_URI=http://localhost:5000
   ```