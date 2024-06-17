# WebChatter
WebChatter is a full-stack, web-based chat application designed for seamless and secure real-time communication. With support for one-to-one and group chats, it offers a user-friendly interface and robust backend services to ensure an engaging chat experience.

## Features
* Real-Time Messaging: Instant communication powered by Socket.IO.
* One-to-One and Group Chats: Connect privately or collaborate in groups.
* Secure Authentication: Implemented using JWT and bcrypt for password encryption.
* User Search: Quickly find and connect with other users.
* Notifications: Stay updated with real-time chat notifications.
* Message Persistence: Ensures chat history is stored securely and remains accessible.

## Tech Stack
### Frontend:
* Angular: Framework for building the user interface.
* Angular Material: For a responsive and modern design.
### Backend:
* Node.js: Runtime environment for server-side scripting.
* Express.js: Web framework for building the RESTful API.
* Socket.IO: Enables real-time, bi-directional communication.
* MongoDB: NoSQL database for efficient data storage.

## Installation
### Prerequisites
* Ensure you have the following installed on your machine:
Angular (v10 or above),
Node.js (v16+ recommended),
npm (comes with Node.js),
MongoDB

## Steps
1. Clone the repository:
```
git clone https://github.com/yourusername/webchatter.git
cd webchatter
```

2. Install dependencies for the backend and frontend:
```
npm install
cd frontend && npm install
```
3. Set up environment variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. Start the application:
* Backend
```
npm run dev-backend
```
* Frontend
```
npm run dev-frontend
```
5. Open the application in your browser at http://localhost:4200.

## Screenshots
![image](https://github.com/user-attachments/assets/59834d2a-39b4-4115-9c90-47d54865ed7d)
![image](https://github.com/user-attachments/assets/711f36bb-17aa-4587-8977-801b94e92394)
![image](https://github.com/user-attachments/assets/4c6854b5-2e8a-4edb-9b15-47390a469d39)
![image](https://github.com/user-attachments/assets/80131cf3-e734-4c7b-ad8d-bafb0963bc9f)
![image](https://github.com/user-attachments/assets/da744cbc-bb7d-459c-85d9-b59bbcc78494)