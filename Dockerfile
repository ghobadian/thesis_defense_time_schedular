# Multi-stage build for optimized image size
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -q

# Production stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root user for security (recommended for production)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 80 to match deploy.yml configuration
EXPOSE 80

# Run the application on port 80
# Using JVM options for container optimization
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Dserver.port=80", \
    "-jar", "app.jar"]
