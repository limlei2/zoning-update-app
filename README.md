# Zonig Update App

## Getting Started

#### Prerequisites

- Java 11
- Maven 3.6+
- Node.js
- npm or yarn

#### Configuration

Create a `.env` file in the `frontend/` directory to manage environment variables securely.

#### `frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_MAPTILER_KEY=your_maptiler_key
```

Replace the placeholder variables in `src/main/resources/application.properties` with either hardcoded values or keep ${} syntax to pull from environment variables 

#### `backend/.env`
```env
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Make sure these environment variables are provided via your deployment environment

#### Installation (Backend)

1. Navigate to backend directory
2. Run `mvn clean spring-boot:run` to run Spring Boot app

#### Installation (Frontend)
1. Navigate to frontend directory
2. Run `npm install` to install all required dependencies.
3. Run `npm start` to start development server on http://localhost:3000

## Assumptions Made

## Deployment
The project is deployed across AWS using the following setup:

### Frontend Deployment (React)
The React app is built with: `npm run build`

The static files (/build) are deployed to an AWS S3 bucket with static website hosting enabled.

The public URL of the app is: http://zoning-update.s3-website.us-east-2.amazonaws.com

### Backend Deployment (Spring Boot)
The backend is built and deployed through AWS CodePipeline.

CodePipeline pulls from GitHub, builds the app using AWS CodeBuild, and deploys it to Elastic Beanstalk.
