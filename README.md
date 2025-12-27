# Baixaki2

![Status](https://img.shields.io/badge/status-educational-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=nodedotjs)

A web application project focused on studying and testing **HTTP Methods**. This project integrates a simple frontend with a Node.js/Express backend and a JSON Server database.

## 🚀 How to Run

To run the application correctly, you need to execute two separate processes (the database and the server).

**Please open two terminal windows and run the following commands:**

### Terminal 1: Database
Start the simulated backend (JSON Server):
```bash
npm run backend
```
> *Runs on port 2000*

### Terminal 2: Server
Start the application server:
```bash
npm run server
```
> *Runs on port 8000 (with Nodemon)*

Access the application at `http://localhost:8000`.

---

## �️ Tech Stack

- **[Express](https://expressjs.com/)**: Fast, unopinionated, minimalist web framework for Node.js.
- **[JSON Server](https://github.com/typicode/json-server)**: Get a full fake REST API with zero coding.
- **Nodemon**: Utility that monitors for any changes in your source and automatically restarts your server.

## 📝 Notes

> **Design**: The interface design was polished with the help of **Gemini**.

> **Fun Fact**: You might notice a file named `or.txt`. It exists solely because my physical keyboard is missing the `|` (pipe) key! 😂