# ☕ TableTalk: Cafe Management System

**TableTalk** is a full-stack, real-time cafe management platform designed to streamline the experience for both customers and cafe administrators. It features a seamless ordering interface for users and a powerful, secure dashboard for staff to manage menus and track orders in real-time.

---

## 🚀 Live Demo

| Component | Live URL |
| :--- | :--- |
| **Customer App** | [https://tabletalkdemo.web.app/](https://tabletalkdemo.web.app/) |
| **Admin Dashboard** | [https://tabletalkadmindemo.web.app/](https://tabletalkadmindemo.web.app/) |

> **🔑 Admin Credentials for Testing:**
> * **Email:** `admin@tabletalk.com`
> * **Password:** `admin123`

---

## ✨ Key Features

### 🛒 Customer Application
* **Interactive Menu:** Browse a high-resolution menu with categorized items (Beverages, Snacks, Mains, Desserts).
* **Dietary Indicators:** Clear labels for Veg/Non-Veg and in-stock availability.
* **Real-time Ordering:** Seamless order placement with instant status feedback.
* **Responsive Design:** Fully optimized for mobile and desktop browsing.

### 🔐 Admin Panel
* **Secure Authentication:** Protected login for authorized cafe personnel.
* **Menu Management:** Full CRUD functionality for menu items, including image uploads via **Multer**.
* **Order Tracking:** Live view of incoming orders with the ability to update status (Pending/Completed).
* **Data Persistence:** Managed via **MongoDB Atlas** for reliable storage.

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white)

* **React.js & Vite:** Fast build tool and modern UI state management.
* **Tailwind CSS:** Utility-first CSS framework for responsive styling.
* **Socket.io-client:** Real-time bi-directional communication for order updates.

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

* **Node.js & Express:** Scalable server-side architecture.
* **MongoDB Atlas:** Cloud-hosted NoSQL database for flexible data storage.
* **JWT & Bcrypt.js:** Secure authentication and industry-standard password hashing.
* **Multer:** Middleware for handling `multipart/form-data` (menu image uploads).

### Infrastructure
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

* **Firebase Hosting:** Multisite deployment for separate Client and Admin applications.
* **Render:** High-performance cloud hosting for the Node.js API environment.

---

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/RajasDeshpande/PrivateTableTalkDemo.git](https://github.com/RajasDeshpande/PrivateTableTalkDemo.git)
   cd PrivateTableTalkDemo
   ``` 
2. **Backend Configuration**:

    Navigate to the backend folder and create a .env file:
    ```bash
    PORT=5000
    MONGODB_URI=your_mongodb_atlas_uri
    JWT_SECRET=your_secret_key
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=your_secure_password
    ```

3. **Install & Launch**
    ```bash
    # Term 1: Backend
    cd Backend && npm install && npm start

    # Term 2: Customer App
    cd customer-app && npm install && npm run dev

    # Term 3: Admin Panel
    cd admin-panel && npm install && npm run dev
    ```
    ---
   
## 👥 Contributors

| Contributor | Role | GitHub Profile |
| :--- | :--- | :---: |
| **Rajas Deshpande** | **Lead Developer** | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/RajasDeshpande) |
| **Sai Chavan** | **Co-Lead Developer** | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/saichavan6189) |


---

## 📧 Contact

### **Rajas Deshpande** (Lead Developer)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)]([YOUR_LINKEDIN_URL_HERE](https://www.linkedin.com/in/rajas-deshpande-087589388))
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rajasmd.2008@gmail.com)

### **Sai Chavan** (Co-Lead Developer)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](linkedin.com/in/sai-chavan-639673402/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sai2008chavan@gmail.com)

---
