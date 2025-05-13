# enterprise-ai-backend

enterprise-ai-backend/
│── src/
│   ├── config/
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   ├── env.ts
│   │   ├── swagger.ts   
│   │
│   ├── routes/
│   │   ├── chatRoutes.ts
│   │
│   ├── controllers/
│   │   ├── chatController.ts
│   │
│   ├── services/
│   │   ├── chatService.ts
│   │
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── cacheMiddleware.ts
│   │
│   ├── utils/
│   │   ├── responseFormatter.ts
│   │   ├── vectorUtils.ts
│   │   ├── logger.ts 
│   │
│   ├── app.ts
│   ├── server.ts
│
│── tests/                 
│   ├── chat.test.ts
│
│── .env
│── package.json
│── tsconfig.json
│── README.md
│── Dockerfile
│── docker-compose.yml
│── nodemon.json
│── .gitignore
│── dist/                   
│── logs/                  
