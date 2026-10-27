# Daily Expense Tracker Web Application

A full-stack multi-user web application designed to help users track and manage money spent during everyday activities. Users can create private accounts, securely log in, record each expense, filter transactions by category, edit and delete entries, view total spending, and gain instant clarity on where their money is going.

---

## Key Features

- **User Registration & Login**:
  - Secure authentication with salted password hashing (PBKDF2-HMAC-SHA256).
  - Private user sessions with token-based authentication.
  - Multi-user data isolation (each user sees only their own expenses and totals).
  - Quick **One-Click Demo Account** button (`demo` / `demo123`) with pre-seeded sample data for immediate exploration.
  - User profile badge in top header with **Sign Out** button.
- **Add Expense**: Record expenses with a **Title**, **Amount**, **Category** (Food, Travel, Shopping, Utilities, Entertainment, Health, Other), and **Date**.
- **View Expenses**: A clean, responsive list & data table showing formatted amounts, dates, and color-coded category badges.
- **Edit & Delete**: Easily modify existing expenses or delete accidental records with a confirmation dialog.
- **Total Amount Spent**: Prominently display cumulative spending across all expenses as well as live filtered amounts.
- **Category Filtering & Insights**: Filter by categories to review spending in specific areas, visual breakdown bars showing percentage of total spent, search expenses by title, and sort by date or amount.
- **Persistent Storage**: Backed by a Spring Boot backend using a persistent file-based H2 database (`./data/expensedb`), ensuring all records survive page reloads and backend restarts.
- **Robust Validation**: Enforces non-empty titles and strictly positive amounts (`> 0`) on both client and server side with clear error messaging.
- **User Feedback**: Toast notifications for operations (creation, editing, deletion) and intuitive validation error messages.

---

## Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Modern Responsive CSS.
- **Backend**: Java 21/23, Spring Boot 3.3.4 (REST API, Spring Data JPA, Jakarta Bean Validation).
- **Database**: H2 Database (File-persisted: `jdbc:h2:file:./data/expensedb`).

---

## API Endpoints

### Authentication APIs
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Authenticate user & return token |
| `GET` | `/api/auth/me` | Fetch active user profile using Bearer token |
| `POST` | `/api/auth/logout` | Invalidate current user session |

### Expense APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Retrieve current user's expenses (optional: `?category=Food`) |
| `GET` | `/api/expenses/{id}` | Retrieve a specific expense by ID |
| `POST` | `/api/expenses` | Add a new expense (validates non-empty title & positive amount) |
| `PUT` | `/api/expenses/{id}` | Update an existing expense by ID |
| `DELETE` | `/api/expenses/{id}` | Delete an expense by ID |
| `GET` | `/api/expenses/summary` | Retrieve total amount spent, transaction count, and category breakdown |
| `GET` | `/api/expenses/categories` | Retrieve supported categories |

---

## Running the Application

### Option 1: Unified Application (Recommended)
Run the Spring Boot application. The built React frontend is included directly in the JAR.
```cmd
run-backend.bat
```
Then open your browser at:
👉 **`http://localhost:8080`**

### Option 2: Live Development Mode
1. Start backend:
```cmd
run-backend.bat
```
2. Start React Vite frontend:
```cmd
run-frontend.bat
```
Open your browser at:
👉 **`http://localhost:5173`**
