# JUVerse Backend API Documentation

## Base URL
```
https://juverse-backend.onrender.com/api/
```

## 1️⃣ Authentication API (`/api/auth`)
| Method | Endpoint      | Description            |
|--------|-------------|------------------------|
| POST   | `/login`    | User login             |
| POST   | `/register` | New user registration  |
| POST   | `/logout`   | User logout            |

---

## 2️⃣ User API (`/api/user`)
| Method | Endpoint   | Description          |
|--------|-----------|----------------------|
| GET    | `/`       | Get all users        |
| GET    | `/:id`    | Get user by ID       |
| PUT    | `/:id`    | Update user info     |
| DELETE | `/:id`    | Delete user          |

---

## 3️⃣ Event API (`/api/event`)
| Method | Endpoint    | Description          |
|--------|------------|----------------------|
| GET    | `/`        | Get all events       |
| GET    | `/:id`     | Get event by ID      |
| POST   | `/create`  | Create a new event   |
| PUT    | `/:id`     | Update an event      |
| DELETE | `/:id`     | Delete an event      |

---

## 4️⃣ Team API (`/api/team`)
| Method | Endpoint   | Description         |
|--------|-----------|---------------------|
| GET    | `/`       | Get all teams       |
| GET    | `/:id`    | Get team by ID      |
| POST   | `/create` | Create a new team   |
| PUT    | `/:id`    | Update team details |
| DELETE | `/:id`    | Delete a team       |

---

## 5️⃣ Team Members API (`/api/team/member`)
| Method | Endpoint  | Description             |
|--------|----------|-------------------------|
| GET    | `/`      | Get all team members    |
| POST   | `/add`   | Add a member to a team  |
| DELETE | `/:id`   | Remove a team member    |

---

## 6️⃣ File Access API (`/api/assets`)
| Method | Endpoint   | Description         |
|--------|-----------|---------------------|
| GET    | `/`       | List all files      |
| GET    | `/:id`    | Get file details    |
| POST   | `/upload` | Upload a new file   |

---

## Authentication & Headers
Most protected routes require **JWT Authentication**. Send the token in headers:
```
Authorization: Bearer {your-token}
```

