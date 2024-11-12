Here’s a complete `README.md` for your project:

---

# Gemini API Tester

This is a full-stack application to interact with the Gemini API, built using Node.js, Express, React, and Vite.

## Features

- A frontend UI to submit prompts and interact with the Gemini API.
- Backend server to handle requests, interact with the Gemini API, and proxy requests to avoid CORS issues.
- Selectable models for generating responses.
- Display response time and error handling.

## Project Structure

```
gemini-app/
├── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── GeminiTester.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── backend/
    ├── server.js
    ├── .env
    └── package.json
```

## Setup Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gemini-app
```

### 2. Create Project Structure

```bash
mkdir frontend backend
```

### 3. Set Up Backend (Node.js)

Navigate to the backend folder, initialize a new Node.js project, and install dependencies:

```bash
cd backend
npm init -y
npm install express dotenv @google/generative-ai cors
npm install nodemon --save-dev
```

Return to the root directory:

```bash
cd ..
```

### 4. Set Up Frontend (React + Vite)

In the `frontend` folder, create a new Vite project with the React template:

```bash
cd frontend
npm create vite@latest . -- --template react
npm install axios
```

Return to the root directory:

```bash
cd ..
```

## Configuration

### Backend Setup

1. Create a `.env` file in the `backend` folder with the following variables:

   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```

2. Create the backend server file in `backend/server.js`:

   - Full code provided in the guide.

3. Update backend `package.json` scripts:

   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

### Frontend Setup

1. Create `GeminiTester.jsx` in `frontend/src/components`:

   - Full code provided in the guide.

2. Update `frontend/src/App.jsx` to include `GeminiTester` component.

3. Add CSS in `frontend/src/index.css`.

4. Update `frontend/vite.config.js` to set up a proxy for the backend:

   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000,
       proxy: {
         '/api': {
           target: 'http://localhost:3001',
           changeOrigin: true
         }
       }
     }
   })
   ```

## Running the Application

1. In the root directory, create a `package.json` to manage both frontend and backend services with `concurrently`:

   ```json
   {
     "name": "gemini-app",
     "version": "1.0.0",
     "scripts": {
       "start": "concurrently \"npm run backend\" \"npm run frontend\"",
       "backend": "cd backend && npm run dev",
       "frontend": "cd frontend && npm run dev",
       "install-all": "npm install && cd frontend && npm install && cd ../backend && npm install"
     },
     "devDependencies": {
       "concurrently": "^8.2.2"
     }
   }
   ```

2. Install dependencies and start the application:

   ```bash
   npm install
   npm run install-all
   npm start
   ```

3. The application should now be running:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:3001](http://localhost:3001)

---

