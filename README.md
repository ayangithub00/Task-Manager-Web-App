# TaskManager 🗂️

A full-stack project management web application where **Project Owners** can create projects, add team members, and assign tasks — and **Team Members** can log in and track their assigned work.

Built with **Django REST Framework** on the backend and **React + Tailwind CSS** on the frontend, secured with **JWT authentication**.

---

## What Does This Project Do?

TaskManager solves a simple problem: how do you organize work across a team?

- An **Owner** signs up, creates a project, adds members to it, and assigns tasks to each member with a priority and due date.
- A **Member** signs up, gets added to a project by an owner, logs in, and sees only the tasks assigned to them.
- Both can see a **dashboard** with live stats and charts showing task progress.

---

## Features

### Authentication
- Register with a username, email, password, and **role** (Owner or Member)
- Login with JWT — access token + refresh token
- Secure logout that **blacklists the refresh token** on the server so it can't be reused
- Role stored in browser so UI adapts without extra API calls

### Owner Features
- Create projects and add team members from a dropdown of real users
- View all members inside each project
- Assign tasks to specific members with title, description, priority, status, and due date
- Edit and delete projects
- See a dashboard with charts showing weekly activity, task breakdown, and progress over time

### Member Features
- See all projects they have been added to
- View tasks assigned to them inside each project
- Cannot create projects or assign tasks — backend enforces this, not just the frontend

### Dashboard (Both Roles)
- Live stat cards — total projects, assigned tasks, completed tasks
- **Area chart** — tasks completed each day this week (real data)
- **Bar chart** — completed vs total tasks over the last 4 weeks (real data)
- **Donut chart** — breakdown of Done / In Progress / Todo tasks (real data)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 4, Django REST Framework |
| Authentication | SimpleJWT (access + refresh tokens) |
| Frontend | React 18, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Database | SQLite (development) |

---

## Project Structure

```
backend/
├── user/           # Custom User model, register, login, logout, dashboard, user list
├── projects/       # Project CRUD, member management
└── tasks/          # Task CRUD, comments, stats endpoint

frontend/
├── API/            # auth.js, project.js, task.js — all fetch calls in one place
├── Pages/          # login, signup, dashboard, createproject, projectdetail, editproject
└── Components/     # navbar, projectcard, taskcard, taskform
```

---

## API Endpoints

### Auth & User
| Method | Endpoint | Description | Who |
|---|---|---|---|
| POST | `/api/v1/register/` | Register new user with role | Anyone |
| POST | `/api/v1/auth/login/` | Login, get JWT tokens | Anyone |
| POST | `/api/v1/logout/` | Blacklist refresh token | Logged in |
| GET/PATCH | `/api/v1/profile/` | View or update profile | Logged in |
| GET | `/api/v1/dashboard/` | Stats + chart data | Logged in |
| GET | `/api/v1/users/` | List all users (for dropdowns) | Logged in |

### Projects
| Method | Endpoint | Description | Who |
|---|---|---|---|
| GET | `/api/v1/project/` | List your projects | Logged in |
| POST | `/api/v1/project/` | Create a project | Owners only |
| GET | `/api/v1/project/{id}/` | Get project detail | Members + Owner |
| PATCH | `/api/v1/project/{id}/` | Edit project | Project owner only |
| DELETE | `/api/v1/project/{id}/` | Delete project | Project owner only |
| GET | `/api/v1/project/{id}/members/` | List project members | Logged in |

### Tasks
| Method | Endpoint | Description | Who |
|---|---|---|---|
| GET | `/api/v1/tasks/` | List your tasks | Logged in |
| POST | `/api/v1/tasks/` | Create a task | Project owner only |
| PATCH | `/api/v1/tasks/{id}/` | Update a task | Project owner only |
| DELETE | `/api/v1/tasks/{id}/` | Delete a task | Project owner only |
| GET | `/api/v1/tasks/stats/` | Get task counts by status | Logged in |

---

## How to Run Locally

### Backend

```bash
# Clone the repo and go to the backend folder
cd backend

# Create a virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start the server
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:8000`

---

## Key Design Decisions

**Role-based access is enforced on the backend, not just the frontend.**
Even if someone removes the frontend check, the backend will reject the request with a 403 Forbidden if the user's role is not owner.

**JWT refresh token is blacklisted on logout.**
Deleting the token from localStorage is not enough — if someone copied the token, they could still use it. Blacklisting makes the token invalid on the server permanently.

**Each user only sees their own data.**
The `get_queryset` method on every ViewSet filters results based on the logged-in user. No one can see another user's projects or tasks just by changing an ID in the URL.

**Dashboard charts use real data.**
A `completed_at` date field on the Task model records exactly when each task was marked as Done. The backend groups these by day and week to return real chart data — no hardcoded sample numbers.

---

## Bugs Fixed During Development

These are real bugs that were debugged and solved during this project:

| Bug | Cause | Fix |
|---|---|---|
| 400 on project creation | `owner_username` field not marked `read_only=True` in serializer | Added `read_only=True` |
| Project appearing 4x in dashboard | M2M JOIN returning duplicate rows | Added `.distinct()` to queryset |
| 500 on project delete | `related_name="project"` collided with Django's internal accessor | Renamed to `related_name="tasks"` |
| Logout not secure | Only clearing localStorage, not blacklisting token | Added backend logout call |
| Hardcoded `assigned_to: 1` in task creation | Placeholder never removed | Replaced with real user dropdown |

---

## Author

Built as a personal full-stack project to learn Django REST Framework, JWT authentication, and React — covering backend API design, role-based permissions, database relationships, and frontend state management.
