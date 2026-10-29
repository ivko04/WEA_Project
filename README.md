# 📚 Book Catalog Application (WEA Project)

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3+-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?style=flat&logo=nginx&logoColor=white)](https://nginx.org/)

A modern, full-stack web application designed for browsing, searching, and managing books. 
The frontend is built with **React** and served via **Nginx**, while the backend is developed using **Flask** (SQLAlchemy, Flask-Login, Flask-Session) and backed by a **PostgreSQL** database. The entire ecosystem is containerized using **Docker** and orchestrated with **Docker Compose** for streamlined deployment, isolated environments, and scalability.

---

## 📑 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture & Ports](#architecture--ports)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Running](#installation--running)
- [API Endpoints](#api-endpoints)
- [Linting & Code Quality](#linting--code-quality)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 📖 **Browse & Explore Books:** View a rich catalog of books with covers, titles, authors, categories, descriptions, and ratings.
- 🔍 **Search & Filtering:** Search books seamlessly by title, author, or category.
- 🔐 **User Authentication:** Complete authentication system (registration, secure login with bcrypt password hashing, session management, and logout).
- 💬 **Comments & Ratings:** Users can leave reviews and comments on books.
- 🛒 **Order Management:** Place orders and track order history.
- 🗄️ **Automatic CSV Import:** Seeds the database automatically with book data from `data_mock.csv` upon first startup.
- 🛠️ **CloudBeaver SQL Client:** Built-in web-based SQL client to inspect and manage database tables easily.
- 🐳 **Full Dockerization:** One-command startup for frontend, backend, PostgreSQL, CloudBeaver, and linters.
- 📝 **Structured Logging:** Centralized logging for both backend requests and frontend Nginx access.

---

## 🛠️ Technologies Used

### Frontend
- **React.js** (Hooks, Components, Responsive UI)
- **CSS3** (Custom styling and layout)
- **Nginx** (Reverse proxy and production static server)

### Backend
- **Python 3 / Flask**
- **SQLAlchemy & Alembic** (ORM and database migrations)
- **PostgreSQL** (Relational database)
- **Flask-Login & Flask-Session** (User sessions and auth state)
- **Flask-Bcrypt** (Password hashing)
- **Flask-CORS** (Cross-origin resource sharing)

### Containerization & DevOps
- **Docker** & **Docker Compose**
- **CloudBeaver / DBeaver** (Database management interface)
- **ESLint** (Frontend code quality analysis)
- **Pylint** (Backend static code analysis)

---

## 🌐 Architecture & Ports

When the containers are running, the services are available on the following local ports:

| Service | Technology | Local Port | URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Nginx | `3009` | [http://localhost:3009](http://localhost:3009) |
| **Backend API** | Flask | `8009` | [http://localhost:8009](http://localhost:8009) |
| **SQL Client** | CloudBeaver | `10009` | [http://localhost:10009](http://localhost:10009) |
| **Database** | PostgreSQL | `50009` | `localhost:50009` (internal `5432`) |

---

## 📁 Project Structure

```text
├── backend/
│   ├── database/         # Database initialization and connection logic
│   ├── models/           # SQLAlchemy models (User, Book, Comment, Order, etc.)
│   ├── routes/           # Blueprint route handlers (auth, book, comment, order, audit)
│   ├── utils/            # Helper utilities (CSV import, DB retry handlers)
│   ├── app.py            # Main Flask application entrypoint
│   ├── data_mock.csv     # Mock dataset for automatic seeding
│   ├── Dockerfile        # Backend container configuration
│   └── requirements.txt  # Python dependencies
│
├── frontend/
│   ├── public/           # Static public assets (HTML template, icons)
│   ├── src/              # React source code (components, pages, styles)
│   ├── Dockerfile        # Multi-stage frontend Docker build (Node + Nginx)
│   ├── nginx.conf        # Nginx configuration
│   └── package.json      # Node.js dependencies and scripts
│
├── .env.example          # Example environment variable template
├── .gitignore            # Git ignore configuration
├── docker-compose.yml    # Multi-container orchestration specification
└── README.md             # Project documentation
```

---

## 📋 Prerequisites

Before running the project, make sure you have installed:
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Engine and Docker Compose)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory by copying the sample file:

```bash
cp .env.example .env
```

Default configuration in `.env`:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=postgres

CB_SERVER_HOST=0.0.0.0
CB_SERVER_PORT=8978
```

---

## 🚀 Installation & Running

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Configure environment
```bash
cp .env.example .env
```

### 3. Build and start containers
```bash
docker-compose up --build
```
> Add `-d` flag to run containers in detached mode: `docker-compose up -d --build`

### 4. Open in browser
- **Web Application:** [http://localhost:3009](http://localhost:3009)
- **Backend Health Check:** [http://localhost:8009/books](http://localhost:8009/books)
- **CloudBeaver DB Admin:** [http://localhost:10009](http://localhost:10009)

### 5. Stopping the application
```bash
docker-compose down
```
To remove volumes as well:
```bash
docker-compose down -v
```

---

## 🔌 API Endpoints

### 🔐 Authentication (`/auth` or root routes)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Authenticate user and initialize session |
| `POST` | `/logout` | Terminate session |
| `GET` | `/current_user` | Return authenticated user details |

### 📚 Books
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/books` | Retrieve list of books (supports search and pagination) |
| `GET` | `/books/<id>` | Retrieve specific book details by ID |
| `POST` | `/books` | Create a new book record (authorized) |
| `PUT` | `/books/<id>` | Update existing book record |
| `DELETE` | `/books/<id>` | Remove book record |

### 💬 Comments & Reviews
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/books/<id>/comments` | Get all comments for a book |
| `POST` | `/books/<id>/comments` | Post a new comment/rating |

### 🛒 Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/orders` | Get user order history |
| `POST` | `/orders` | Submit a new order |

---

## 🔍 Linting & Code Quality

Linters are integrated into Docker Compose for code quality checks:

### Run ESLint (Frontend)
```bash
docker-compose run eslint
```

### Run Pylint (Backend)
```bash
docker-compose run pylint
```

---

## 👥 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
