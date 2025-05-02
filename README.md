# Zoning Update App

Deployed on http://zoning-update.s3-website.us-east-2.amazonaws.com

## Getting Started

### Prerequisites

- Java 11
- Maven 3.6+
- Node.js
- npm or yarn

### Configuration

#### Frontend
Create a `.env` file in the `frontend/` directory to manage environment variables securely.

#### `frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_MAPTILER_KEY=your_maptiler_key
```

#### Backend
Replace the placeholder variables in **application.properties** with either hardcoded values or keep ${} syntax to pull from environment variables 

#### `src/main/resources/application.properties`
```env
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Make sure these environment variables are provided via your deployment environment if using the ${} syntax

### Installation (Backend)

1. Navigate to backend directory
2. Run `mvn clean spring-boot:run` to run Spring Boot app

### Installation (Frontend)
1. Navigate to frontend directory
2. Run `npm install` to install all required dependencies.
3. Run `npm start` to start development server on http://localhost:3000

## Assumptions Made

### Frontend
- Parcel data will be fetched only on load or after user submission, polling is not implemented.
- Only four zoning types are considered: `Residential`, `Commercial`, `Industrial` and `Planned`.
- Users are able to select multiple parcels of all zoning types and change them all at once to 1 chosen zoning type.
- The user interface does not require authentication or roles.
- No frontend form validation required, other than ensuring a zoning type is selected.
- Users do not have access to the history of changes in zoning types.

### Backend
- Parcel location and geometry is already stored in the real_estate_zoning table in a PostGIS-compatible format.
- Each parcel has a unique id and a valid, nonempty zoning type (zoning_typ).
- Parcel zoning updates are atomic within a single user submission.

### Assumptions made that led to the use of a JSON file storage system
- Audit log entries only require a unique id, a timestamp, and a message that includes the number of parcels updated and the new zoning type.
- No need for advanced querying or filtering in either of the stored data.
- Audit log size and zoning updates file expected to remain reasonably small.
- Simplified deployment for demo purposes.

## Deployment
The project is deployed across AWS using the following setup:

### Frontend Deployment (React)
The React app is built with: `npm run build`

The static files (/build) are deployed to an AWS S3 bucket with static website hosting enabled.

The public URL of the app is: http://zoning-update.s3-website.us-east-2.amazonaws.com

### Backend Deployment (Spring Boot)
The backend is containerized using Docker and deployed via AWS CodePipeline.

1. **Dockerized Backend**:
   - The Spring Boot application is packaged as a Docker image.
   - A `Dockerfile` is present in the `backend/` directory defining how the application is built and run.

2. **CodePipeline & CodeBuild**:
   - AWS CodePipeline is triggered when changes are pushed to GitHub.
   - CodeBuild uses `buildspec.yml` to:
     - Create a new directory `zoning-backend` and copies Dockerfile and backend source code
     - Exports it as a zipped artifact for deployment

3. **Elastic Beanstalk Deployment**:
   - Elastic Beanstalk is set up as a Docker single-container environment.
   - It receives the zipped `zoning-backend/` artifact from CodeBuild.
   - Beanstalk uses the Dockerfile to build and run the backend in an EC2-managed container.
   - Environment variables are configured in the Elastic Beanstalk environment console.
