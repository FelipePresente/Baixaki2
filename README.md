# Baixaki2

A secure, full-stack web application for managing a game catalog. Built with vanilla JavaScript and Node.js, focusing on clean architecture, security best practices (JWT), and responsive design.

## ⚙️ Features

*   **Authentication & Security:** Robust login system using **JWT** (JSON Web Tokens) verified via middlewares and stored in **HttpOnly Cookies** to prevent XSS attacks.
*   **Role-Based Access:** Protected Admin Dashboard accessible only to users with elevated privileges.
*   **CRUD Operations:** Complete management (Create, Read, Update, Delete) of game entries.
*   **Clean Code:** Implementation of **DRY**, **KISS**, and modular architecture (Router/Controller pattern).
*   **Modern UI:** Responsive design using **Tailwind CSS**.

## 🛠️ Tech Stack

**Frontend**
*   HTML5 & CSS3
*   JavaScript (ES6+)
*   Tailwind CSS

**Backend**
*   Node.js & Express
*   JWT (Authentication)
*   Cookie-Parser (Session Management)
*   JSON Server (REST API Simulation)

## 🚀 How to Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Database (JSON Server)**
    ```bash
    npm run backend
    ```

3.  **Start the Application Server**
    ```bash
    npm run server
    ```

4.  **Access the App**
    Open `http://localhost:8000` in your browser.

## 👤 Credentials for Testing

*   **Admin Access:**
    *   Username: `admin`
    *   Password: `adminpassword`

*   **User Access:**
    *   Username: `user`
    *   Password: `userpassword`
