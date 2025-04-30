# -------- Build Stage --------
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy source and build
COPY backend/pom.xml .
COPY backend/src ./src

# Build the project
RUN mvn clean package -DskipTests

# -------- Runtime Stage --------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the JAR from the builder stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
