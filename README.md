# 🍕 PizzaHub – Full-Stack Pizza Delivery & Inventory Management System (rezorpay left)

A production-grade MERN stack application that allows customers to build custom pizzas, place orders securely, and track their order status in real time. The platform also provides a dedicated admin dashboard for inventory management, order processing, and automated stock notifications.

---

### 👤 User Features

* User registration with email verification
* Secure JWT-based authentication
* Forgot password and reset password flow
* Dashboard displaying available pizza varieties
* Custom Pizza Builder:

  * Choose pizza base
  * Select sauce
  * Select cheese type
  * Add multiple vegetable toppings
* Order summary before checkout
* Payment Integration is still left 
* Real-time order status tracking:

  * Order Received
  * In Kitchen
  * Sent to Delivery

---

### 🛠️ Admin Features

* Separate admin authentication system
* Inventory dashboard for:

  * Pizza Bases
  * Sauces
  * Cheeses
  * Vegetables
* Automatic stock deduction after successful orders
* Manual inventory update functionality
* Configurable low-stock threshold monitoring
* Automated email notifications for low inventory
* Order management panel
* Real-time order status updates for users

---

## 🏗️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Context API
* Socket.io Client

### Backend

* Node.js
* Express.js
* JWT Authentication
* Socket.io
* Node-Cron
* Nodemailer
* Razorpay SDK

### Database

* PostgreSQL and pgAdmin (switched from MongoDb to PostgreSQL as I am quite familiar with it)

---

## 📂 Project Structure

```text
PizzaHub/
│
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── cron/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/pizzahub.git
cd pizzahub
```

### Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:3000

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

LOW_STOCK_THRESHOLD=20
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm start
```

Application URLs:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

---

## 🔄 Order Flow

1. User registers and verifies email.
2. User logs in securely.
3. User builds a custom pizza.
4. Order summary is generated.
5. User completes payment using Razorpay Test Mode.
6. Inventory is automatically updated.
7. Admin receives and processes the order.
8. Order status updates are reflected in real time on the user's dashboard.

---

## 📧 Automated Inventory Notifications

A scheduled background job continuously monitors inventory levels. Whenever any item falls below the configured threshold, the system automatically sends an email alert to the administrator for timely restocking.

---

## 🔒 Security Features

* Password hashing using bcrypt
* JWT-based authentication and authorization
* Protected API routes
* Email verification
* Password reset via secure email links
* Role-based access control for Admin and User

---

## 🎯 Learning Outcomes

This project demonstrates:

* Full-stack MERN application development
* Authentication and authorization
* Payment gateway integration
* Real-time communication with WebSockets
* Inventory management systems
* Scheduled background jobs
* Email service integration
* RESTful API design and database modelling
* Production-level application architecture

---

## 👨‍💻 Author

**Mahmodur Rahman Sajib**

BUET CSE Undergraduate
Passionate about Full-Stack Development, Data Analytics, and Building Scalable Software Systems.

---

⭐ If you found this project useful, consider giving it a star on GitHub.
