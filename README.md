# Baixaki2

A secure, full-stack web application designed for managing a digital game catalog. Built with **Node.js** and **MongoDB**, this project emphasizes clean architecture, robust security practices, and professional REST API standards.

## ⚙️ Features

*   **Advanced Security:**
    *   Authentication via **JWT** (JSON Web Tokens) stored in **HttpOnly Cookies** to prevent XSS.
    *   **Role-Based Access Control (RBAC)** protecting Admin routes.
    *   Data sanitization middlewares to normalize inputs and prevent injection risks.
*   **Robust Backend:** 
    *   **MongoDB + Mongoose** for scalable data persistence and strict Schema Validation.
*   **Clean Architecture:** Modular structure separating Routes, Models (Schemas), and Middlewares.
*   **Modern UI:** Responsive interface designed with **Tailwind CSS**.

## 🛠️ Tech Stack

**Backend**
*   **Runtime:** Node.js & Express.js
*   **Database:** MongoDB Atlas & Mongoose ODM
*   **Authentication:** JSON Web Tokens (JWT) & Cookie-Parser
*   **Utilities:** Dotenv

**Frontend**
*   HTML5 & CSS3
*   JavaScript (ES6+)
*   Tailwind CSS (CDN/Integration)

## 🚀 How to Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Server**
    ```bash
    npm run server
    ```

3.  **Access the Application**
    Open `http://localhost:8000` in your browser.

## 👤 Credentials for Testing

*   **Admin Access:**
    *   Username: `admin`
    *   Password: `adminpassword`

*   **User Access:**
    *   Username: `user`
    *   Password: `userpassword`