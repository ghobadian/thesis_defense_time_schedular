# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build argument for API URL
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build the app
RUN npm run build

# Production stage - just copy build files
FROM alpine:latest

WORKDIR /app

# Copy build output
COPY --from=build /app/build ./build

# Keep container running (nginx will serve the files via volume)
CMD ["tail", "-f", "/dev/null"]
