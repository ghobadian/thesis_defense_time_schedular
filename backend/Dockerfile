# ── Stage 1: Resolve dependencies (cached until pom.xml changes) ──
FROM maven:3.9-eclipse-temurin-21 AS deps
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

# ── Stage 2: Run tests (cached until src/ changes) ──
FROM deps AS test
COPY src ./src
RUN mvn verify -B -q

# ── Stage 3: Build production JAR (reuses test stage, no recompile) ──
FROM test AS build
RUN mvn package -DskipTests -q

# ── Stage 4: Production runtime ──
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN apk add --no-cache wget

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/target/*.jar app.jar

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Dserver.port=8080", \
    "-jar", "app.jar"]
