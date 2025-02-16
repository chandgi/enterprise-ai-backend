# Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start"]


# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    container_name: enterprise-ai-backend
    ports:
      - "3002:3002"
    depends_on:
      - db
      - redis
    env_file:
      - .env
    volumes:
      - .:/app
      - /app/node_modules

#   db:
#     image: postgres:15
#     container_name: postgres-db
#     restart: always
#     environment:
#       POSTGRES_USER: postgres
#       POSTGRES_PASSWORD: yourpassword
#       POSTGRES_DB: enterprise_ai
#     ports:
#       - "5432:5432"
#     volumes:
#       - pg_data:/var/lib/postgresql/data

#   redis:
#     image: redis:latest
#     container_name: redis-cache
#     restart: always
#     ports:
#       - "6379:6379"

# volumes:
#   pg_data: