# Zonig Update App

## Getting Started

#### Prerequisites

- Java 11
- Maven 3.6+
- Node.js
- npm or yarn

#### Configuration

Create `.env` files in both the `backend/` and `frontend/` directories to manage environment variables securely.

#### `backend/.env`
```env
DB_URL=database_url
DB_USER=database_username
DB_PASSWORD=database_password
```
#### `frontend/.env`
```env
REACT_APP_BACKEND_URL=backend_api_url
REACT_APP_MAPTILER_KEY=your_maptiler_key
```

#### Installation (Backend)

1. Navigate to backend directory
2. Run `mvn clean spring-boot:run` to run Spring Boot app

#### Installation (Frontend)
1. Navigate to frontend directory
2. Run `npm install` to install all required dependencies.
3. Run `npm start` to start development server.

## Assumptions Made:
