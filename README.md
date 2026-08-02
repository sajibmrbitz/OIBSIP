# 🍕 PizzaHub – Full-Stack Pizza Delivery & Inventory Management System

A production-grade full-stack application that allows customers to build custom pizzas, place orders securely, and track their order status in real time. The platform also provides a dedicated admin dashboard for inventory management, order processing, and automated stock notifications.

This project was built to fulfill the **LEVEL 3** task requirements of a complex full-stack pizza ordering and inventory management platform.

---

## 📋 Task Requirements & Checklist

### 👤 User Side
- [x] User registration with email verification
- [x] User login with JWT-based authorisation
- [x] Forgot password flow (email reset link)
- [x] Dashboard displaying available pizza varieties
- [x] Custom pizza builder flow:
  - [x] Step 1: Choose a pizza base (5 options)
  - [x] Step 2: Choose a sauce (5 options)
  - [x] Step 3: Choose a cheese type
  - [x] Step 4: Choose vegetables (multiple select)
- [x] Order summary page before payment
- [x] Razorpay checkout integration (test mode — clicking "Success" confirms the order)
- [x] Real-time order status display on user dashboard (Order Received → In Kitchen → Sent to Delivery)

### 🛠️ Admin Side
- [x] Separate admin login (not accessible from the user registration flow)
- [x] Inventory dashboard showing current stock of: pizza bases, sauces, cheeses, vegetables
- [x] Stock automatically decremented after each order
- [x] Manual stock update capability for each inventory item
- [x] Automated email notification to admin when any inventory item falls below a configurable threshold (e.g., pizza bases < 20 units) — implemented using `node-cron`
- [x] Order management panel: view all incoming orders, update status for each order
- [x] Status change reflected in real-time on the user's dashboard (using WebSockets)

---

## 🏗️ Tech Stack

### Frontend
* React.js (built with Vite)
* TailwindCSS
* React Router
* Axios
* Socket.io Client

### Backend
* Node.js & Express.js
* PostgreSQL (using `pg` driver)
* JWT Authentication
* Socket.io (for real-time updates)
* Node-Cron (for background inventory jobs)
* Nodemailer (for low-stock alert emails)

---

## ⚠️ Important Implementation Changes & Design Decisions

During development, a few modifications were made to the original requirements to improve the development experience and system architecture:

### 1. Switched from MongoDB to PostgreSQL
**Reason:** While the original requirement suggested MongoDB, the database was switched to **PostgreSQL**. A pizza delivery system heavily relies on structured, relational data (e.g., an order maps to specific inventory items, and inventory counts must be strictly decremented in ACID-compliant transactions). PostgreSQL is perfectly suited for this, and the developer was already highly familiar with relational modeling. 

### 2. Custom "Fake" Razorpay Modal
**Reason:** Razorpay recently updated their test mode policies. New test keys no longer support "direct" client-side checkout without a fully verified merchant account (KYC). When attempting to use the official test scripts, it throws a "No appropriate payment method found" error. 
To fulfill the requirement of a seamless checkout flow without requiring future evaluators to set up their own Razorpay Merchant accounts, a custom `FakePaymentModal.jsx` was built. This modal perfectly mimics the Razorpay UI, captures dummy card details, simulates a network delay, and hits the backend `/payment/verify` route to trigger the automated inventory deduction upon success.

---

## 📂 Project Structure

```text
PizzaHub/
│
├── WebDev-L3-PizzaDeliveryApp/
│   ├── client/                 # React frontend (Vite)
│   │   ├── src/
│   │   │   ├── components/     # UI Components (e.g. FakePaymentModal)
│   │   │   ├── pages/          # Dashboard, Checkout, etc.
│   │   │   └── ...
│   │   └── package.json
│   │
│   ├── server/                 # Express backend
│   │   ├── config/             # DB & Cron configurations
│   │   ├── controllers/        # Payment, Order, Auth controllers
│   │   ├── middleware/         # Auth & Error handling
│   │   ├── routes/             # API endpoints
│   │   └── server.js           # Entry point
│   │
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository
```bash
git clone https://github.com/sajibmrbitz/OIBSIP.git
cd OIBSIP/WebDev-L3-PizzaDeliveryApp
```

### Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd ../server
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory using `.env.example` as a template:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/pizza_delivery
PORT=5000

EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_test_email@ethereal.email
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin@pizzadelivery.com

CLIENT_URL=http://localhost:5173
```

---

## ▶️ Running the Application

### Start Backend
```bash
cd server
npm run dev
```

### Start Frontend (Vite)
```bash
cd client
npm run dev
```

**Application URLs:**
* Frontend: `http://localhost:5173`
* Backend: `http://localhost:5000`

---

## 🔄 Order Flow Summary

1. User registers/logs in securely.
2. User builds a custom pizza from available inventory.
3. Order summary is generated with total pricing.
4. User completes payment using the simulated Razorpay Modal (Demo Mode).
5. Payment verification triggers an ACID transaction in the PostgreSQL backend:
   - Order status is set to PAID.
   - Inventory items (bases, sauces, cheeses, veggies) are automatically deducted.
6. Admin receives the order on their dashboard.
7. Admin updates order status (e.g., In Kitchen → Sent to Delivery).
8. Order status updates are pushed in real-time to the user's dashboard via Socket.io.
9. If inventory falls below the threshold, `node-cron` triggers an automated email via `nodemailer` to restock.

---

## 👨‍💻 Author

**Mahmodur Rahman Sajib**

BUET CSE Undergraduate
Passionate about Full-Stack Development, Data Analytics, and Building Scalable Software Systems.
