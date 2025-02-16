# Chat App

This is a chat application that provides text generation and embedding functionality. It uses the Ollama API to generate responses based on user input.

## Overview

The application is built using Express.js, Redis, and Axios. It includes controllers, routes, services, and tests.

The application provides the following functionality:

- Chat functionality:
  - Model management
  - Text generation
  - Embedding

- User authentication and authorization:
  - Google OAuth integration

- Error handling and logging:
  - Robust error handling mechanisms in place

- Performance and scalability:
  - Considerations for performance and scalability

## Installation

To install and set up the application, follow these steps:

1. Clone the repository:

git clone https://github.com/your-username/chat-app.git


2. Install dependencies:

cd chat-app npm install


3. Set up environment variables:
- Create a `.env` file in the root directory of the project.
- Set the required environment variables, such as `REDIS_URL`, `FRONTEND_URL`, and `GOOGLE_CLIENT_ID`.

4. Start the application:

npm start


## Testing

To run the tests, follow these steps:

1. Make sure the application is running.

2. Run the tests:

npm start 


## Contributing

If you're interested in contributing to the project, please follow these guidelines:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them.
- Push your changes to your fork.
- Create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or need further assistance, feel free to reach out to [your-email@example.com](mailto:your-email@example.com).

Thank you for considering this chat application!


# Enterprise AI Backend

A full-stack AI-powered enterprise dashboard with React (frontend), Node.js (backend), and Pgvector (for AI-enhanced search & analytics) can provide:

✅ Real-time AI insights with SSE/WebSockets  
✅ Chatbot & RAG-powered search for enterprise data  
✅ Scalable microservices architecture  
✅ Secure authentication & role-based access  

## 🚀 Key Features & Tech Stack

🔹 **Frontend (React + Tailwind + Recharts)** → Interactive UI for AI insights  
🔹 **Backend (Node.js + Express + SSE/WebSockets)** → AI processing & API services  
🔹 **Database (PostgreSQL + Pgvector)** → Storing vector embeddings for search  
🔹 **LLM Fine-Tuning (LoRA/PEFT with Ollama)** → Optimized AI responses  
🔹 **Caching (Redis)** → Speeding up search & reducing AI API calls  
🔹 **Authentication (JWT + RBAC)** → Secure access control  
🔹 **Containerization (Docker + Kubernetes)** → Scalable microservices deployment  
🔹 **Real-time AI Streaming (SSE/WebSockets)** → Instant AI-generated insights  

## 📂 Project Structure

```plaintext
enterprise-ai-backend/
│── src/
│   ├── config/             # Configuration files (DB, Redis, env)
│   │   ├── db.js           # PostgreSQL & Pgvector connection setup
│   │   ├── redis.js        # Redis client setup
│   │   ├── env.js          # Environment variables loader
│   │
│   ├── routes/             # API route handlers
│   │   ├── chatRoutes.js   # Chat model routes (list, generate)
│   │   ├── embedRoutes.js  # Embeddings-related routes
│   │   ├── ollamaRoutes.js # Ollama model management
│   │   ├── memoryRoutes.js # Pgvector search
│   │
│   ├── controllers/        # Controllers for business logic
│   │   ├── chatController.js
│   │   ├── embedController.js
│   │   ├── ollamaController.js
│   │   ├── memoryController.js
│   │
│   ├── services/           # Core services (Redis caching, AI processing)
│   │   ├── chatService.js
│   │   ├── embedService.js
│   │   ├── ollamaService.js
│   │   ├── memoryService.js
│   │
│   ├── middleware/         # Middleware (auth, logging, validation)
│   │   ├── authMiddleware.js
│   │   ├── cacheMiddleware.js
│   │
│   ├── utils/              # Utility functions (helpers)
│   │   ├── responseFormatter.js
│   │   ├── vectorUtils.js
│   │
│   ├── app.js              # Express app setup & middleware
│   ├── server.js           # Main entry point (starts the server)
│
│── .env                    # Environment variables
│── package.json            # Project dependencies
│── README.md               # Documentation
│── Dockerfile              # Containerization setup
│── docker-compose.yml      # Multi-container setup (DB, Redis, API)
│── nodemon.json            # Dev auto-restart configuration
│── .gitignore              # Ignore files for version control


💡 Why this structure?

✅ Separation of Concerns → Routes, Controllers, Services, and Middleware are isolated
✅ Scalability → Easily extend with more features (new AI models, caching, analytics)
✅ Maintainability → Code is modular and reusable
✅ Performance → Redis caching, optimized database queries

 Setup & Installation

git clone https://github.com/yourusername/enterprise-ai-backend.git
cd enterprise-ai-backend

Install dependencies:
npm install 

Set up environment variables: Create a .env file in the root directory and add the following variables:

PORT=3005
ALLOWED_ORIGINS=http://localhost:3002

# PostgreSQL Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=postgres
DB_PASSWORD=password
DB_PORT=5432

# Redis Configuration
REDIS_URL=redis://localhost:6379

Run the application:
npm start

Run tests:
npm test

Each controller calls a corresponding service:

    chatService.js → AI chat streaming
    embedService.js → Text embedding & storing
    memoryService.js → AI memory retrieval
    ollamaService.js → Direct Ollama LLM queries

Enhancements

    ✅ Added jest & supertest → Unit & API testing support.
    ✅ Added eslint & prettier → Code linting & formatting.
    ✅ Added axios & cors → Handling HTTP requests & CORS.
    ✅ Added lint & format scripts → Ensuring code quality.