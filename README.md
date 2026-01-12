# 📚 Library Management System

Hi! 👋 This is a full-stack library management application I built to explore the integration of modern web technologies. My goal was to create a robust system that handles real-world data relationships (Books, Users, Admins) using the latest Java features and a reactive frontend.

## 🚀 About the Project
I designed this application to solve the problem of tracking library inventory efficiently. It bridges a high-performance Java backend with a clean, user-friendly interface.

* **Live Frontend UI:** https://library-system-wsls.onrender.com/

## 🛠 My Tech Stack
I chose these technologies to ensure type safety, performance, and a modern developer experience.

### Backend (The Core)
* **Java 25:** Utilizing the latest preview features for cleaner, more efficient code.
* **Spring Boot 3.x:** For rapid REST API development and dependency injection.
* **Spring Security:** Implementing secure authentication for Admin access.
* **MySQL (Aiven):** A fully managed cloud database for persistent storage.
* **Maven:** Project management and build automation.

### Frontend (The Interface)
* **React.js:** Component-based architecture for a dynamic user experience.
* **Tailwind CSS:** Utility-first CSS for rapid, responsive styling.
* **Axios:** For handling HTTP requests between the client and my server.

### DevOps & Infrastructure
* **Render:** Cloud platform for hosting both the static frontend and the web service backend.
* **UptimeRobot:** configured to ensure that the website never goes down

## ✨ Key Features I Implemented
* **Full CRUD Operations:** Complete management of Book inventory.
* **User Registration:** A system for adding and tracking library members.
* **Secure Admin Mode:** Special access rights protected by server-side verification.
* **Cloud Connectivity:** The app connects seamlessly to a remote MySQL instance, meaning data persists even when the server restarts.
* **Responsive UI:** The layout adapts smoothly to different screen sizes.

## ⚙️ Configuration (Environment Variables)
To keep my security credentials safe, I do not hardcode passwords. If you want to run this project, you will need to set up these environment variables in your IDE or cloud provider.

| Variable Key | Description |
| :--- | :--- |
| `DB_HOST` | The hostname of your MySQL server (e.g., Aiven) |
| `DB_PORT` | The port number for your database connection |
| `DB_NAME` | The name of the database (Must match the one you created) |
| `DB_USER` | Your database username |
| `DB_PASSWORD` | Your database password |
| `admin.password.one` | Value for the first Admin password |
| `admin.password.two` | Value for the second Admin password |

## 📦 How to Run My Code

### 1. Cloning the Repo
Feel free to fork this repository to test it out or suggest improvements.
Contributions are welcome! Please fork the repository and submit a pull request for review.

## 📝 License
This project is open-source and available under the MIT License.