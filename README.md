# 🚀 MERN Content Management System

A full-stack MERN application built as part of the Backend Intern Assignment. It provides user authentication, admin portal, and content CRUD APIs, with a responsive React + Tailwind frontend.


## 🚀 Live Link

[View Live Project](https://vnv-content-management.vercel.app/)

---

## 📂 Project Structure

```
project-root/
│
├── backend/          # Express + MongoDB + JWT + Role-based auth
│   ├── models/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── .env.example
│   └── README.md
│
├── frontend/         # React + Vite + Tailwind
│   ├── src/
│   ├── .env.example
│   └── README.md
│
├── postman/          # Postman API collections
│   └── (Collection files here)
│
└── README.md         # Project root README

```

## 📮 Postman Collection

### Import Instructions

1. **Download Collection Files:**
   - [API Collection](./postman/VNV-CMS-API-Collection.json)
   - [Environment](./postman/VNV-Local-Environment.json)

2. **Import to Postman:**
   - Open Postman
   - Click "Import" button
   - Drag and drop both JSON files
   - Collection and environment will be imported

3. **Setup:**
   - Select "VNV Local Development" environment from dropdown
   - Start your backend server: `npm run server`
   - Test endpoints in this order:
     1. User Signup/Login (saves token automatically)
     2. Admin Login (saves admin_token)
     3. Content endpoints


---

## 🛠️ Tech Stack

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose
- **JWT** Authentication
- **bcrypt** (password hashing)
- **express-validator** (input validation)
- cors + morgan

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- **Axios** (API calls)

---

## ⚡ Features

### User Portal
- Signup & login (JWT-based auth)
- View content list
- Read content details

### Admin Portal
- Admin login
- Create, Update, Delete content
- Role-based access (only admins can modify)

### Security
- Password hashing with bcrypt
- JWT authentication
- Input validation & sanitization

### Other
- API versioning (`/api/v1/...`)
- Error handling
- Postman collection for API testing

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/vnv2315/vnv-content-management.git
cd project-root
```

---

### 2. Backend Setup

Navigate to backend folder:

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster/test
JWT_SECRET=supersecret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=supersecret
```

Run backend:

```bash
npm run dev
```

**Backend runs on:** `http://localhost:5000`

---

### 3. Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
npm install
```

Create `.env` file (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Run frontend:

```bash
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

### Example Endpoints

#### User Signup
**POST** `/api/v1/user/signup`

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### User Login
**POST** `/api/v1/user/login`

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Admin - Create Content
**POST** `/api/v1/content/add` *(Admin only)*

```json
{
  "title": "New Blog Post",
  "author": "John",
  "category": "Tech",
  "readData": "This is the content body"
}
```

---

## 🚀 Scalability Notes

- **Microservices** → Split user-service & content-service
- **Caching** → Use Redis for popular content
- **Load Balancing** → Deploy behind Nginx / AWS ELB
- **Containerization** → Dockerize backend for CI/CD pipeline
- **Database Scaling** → Use MongoDB sharding & indexing

---

## 👨‍💻 Author

**Vishnu N V**  
3rd Year Mechanical Engineering, AIT Pune

- Full-stack MERN Developer
- Passionate about scalable backend systems

---

## ⚡ Environment Setup

- **Backend env** → `.env.example`
- **Frontend env** → `.env.example`
