# Donation App API

This is the backend API for the Donation App, a platform that facilitates donations between donors and receivers.

## Features

- Donor and Receiver Registration & Authentication (including OAuth 2.0)
- Item Listing (create, view, update, delete)
- Request Management (create, view, update, delete)
- Donation Matching based on location and item category
- Real-time Notifications using Socket.io
- Impact Tracking showing statistics about donations and people helped
- Two-way flow with mutual consent:
  1. Donors can browse available requests and offer items directly
  2. Receivers can browse available items and request them
  3. Transactions only occur when both parties agree

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io for real-time notifications
- Multer for file uploads
- Nodemailer for email notifications

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd server
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

### Running the Server

```
npm run server
```

### Seeding the Database

```
npm run seed
```

## API Endpoints

### Authentication

- `POST /api/auth/register/donor` - Register a new donor
- `POST /api/auth/register/receiver` - Register a new receiver
- `POST /api/auth/login` - Login (donor or receiver)
- `POST /api/auth/google` - OAuth 2.0 authentication
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Items

- `GET /api/items` - Get all donation items (with optional filters)
- `GET /api/items/:id` - Get a specific item
- `POST /api/items` - Create a new donation item (donor only)
- `PUT /api/items/:id` - Update an item (donor only)
- `DELETE /api/items/:id` - Delete an item (donor only)

### Requests

- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get a specific request
- `POST /api/requests` - Create a new request (receiver only)
- `PUT /api/requests/:id` - Update a request (receiver only)
- `DELETE /api/requests/:id` - Delete a request (receiver only)

### Donor

- `GET /api/donors/items` - Get all items of the logged-in donor
- `GET /api/donors/transactions` - Get all transactions of the logged-in donor
- `GET /api/donors/impact` - Get impact statistics for the logged-in donor
- `GET /api/donors/available-requests` - Get all available requests (with optional filters)
- `GET /api/donors/item-requests` - Get requests specifically for the donor's items

### Receiver

- `GET /api/receivers/requests` - Get all requests of the logged-in receiver
- `GET /api/receivers/transactions` - Get all transactions of the logged-in receiver
- `GET /api/receivers/impact` - Get impact statistics for the logged-in receiver
- `GET /api/receivers/matching-items` - Get items matching the receiver's requests

### Transactions

- `GET /api/transactions/:id` - Get a specific transaction
- `POST /api/transactions/request` - Request a specific item (receiver only)
- `POST /api/transactions/requests/:requestId/approve` - Approve a request (donor only)
- `POST /api/transactions/requests/:requestId/reject` - Reject a request (donor only)
- `PUT /api/transactions/:id/status` - Update transaction status (donor only)
- `POST /api/transactions/donate` - Donor initiates donation for a general request (donor only)

### Notifications

- `GET /api/notifications` - Get all notifications for the current user
- `PUT /api/notifications/:id/read` - Mark a notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification

### Impact

- `GET /api/impact` - Get overall impact statistics

## Authentication

All protected routes require a JWT token which can be provided in one of two ways:
1. As an HTTP-only cookie (set automatically on login)
2. As a Bearer token in the Authorization header

## File Uploads

Files are uploaded to the `/uploads` directory and served statically at the `/uploads` endpoint.

## Real-time Notifications

Socket.io is used for real-time notifications. Clients should:
1. Connect to the Socket.io server
2. Join their user-specific room using `socket.emit('join', userId)`
3. Listen for 'notification' events

## Donation Workflow

### As a Receiver:
1. **Request an item**: When a receiver requests a specific item:
   - A request is created with a reference to the specific item
   - The donor is notified about the request
   - The request remains pending until the donor approves or rejects it
   - No transaction is created until the donor approves the request

2. **General request**: When a receiver creates a general request without targeting a specific item:
   - The request is added to the request list
   - When a matching item is later added by a donor, the receiver gets notified
   - Donors can browse requests and offer their items

### As a Donor:
1. **Receive requests**: Donors can view requests specifically for their items
   - They can approve the request, which creates a transaction
   - They can reject the request, which leaves the item available
   - Only when approved is a transaction created and the item removed from the available list

2. **Fulfill general requests**: Donors can browse all available requests
   - They can offer one of their items to fulfill a request
   - This creates a transaction directly (since the donor is initiating)

3. **List items**: When adding items:
   - If the item matches existing requests, receivers are notified
   - The item remains available until explicitly given to a receiver

**Note**: Transactions are only created when both parties agree - either:
1. A receiver requests an item and the donor approves it, or
2. A donor offers an item to fulfill a receiver's request 