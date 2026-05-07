# Railway Deployment Guide

This guide details how to deploy the full-stack MERN Team Task Manager directly to Railway.

## 1. Prepare the Codebase

For Railway to deploy both the frontend and backend from a single repository (monorepo), we need to ensure the root `package.json` can trigger the builds, OR we can deploy them as two separate Railway services. 

Deploying as **Two Separate Services** is the recommended and easiest method.

### Backend Preparation (`server/`)
1. Ensure your `server/package.json` has a start script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Frontend Preparation (`client/`)
1. In `client/package.json`, ensure the build scripts are standard:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```
2. Because Vite generates static files, we need a way to serve them in production. 
Install `serve` as a production dependency in the `client` directory:
```bash
npm install serve
```
3. Add a start script to `client/package.json`:
```json
"scripts": {
  "start": "serve -s dist",
  "build": "vite build"
}
```

---

## 2. Deploying the Backend (API)

1. Log into [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Railway will automatically try to deploy the root. We need to tell it to look at the `server/` folder.
5. Go to the Service **Settings** -> **Build**:
   - Set **Root Directory** to `/server`
6. Go to the Service **Variables**:
   - Add `MONGO_URI` = `<your mongodb atlas connection string>`
   - Add `JWT_SECRET` = `<your secure random string>`
   - Add `PORT` = `5000` (Optional, Railway assigns one automatically, but good practice).
7. Go to **Settings** -> **Networking**:
   - Generate a Domain. Save this URL! (e.g., `https://my-backend-production.up.railway.app`).

---

## 3. Deploying the Frontend (React/Vite)

1. Before deploying the frontend, update all your `axios` requests in the React code to point to your new backend URL instead of `http://localhost:5000`. 
   *(Alternatively, configure an environment variable like `VITE_API_URL` and use `axios.get(\`${import.meta.env.VITE_API_URL}/api/...\`)`)*.
2. Commit and push these changes to GitHub.
3. Back in your Railway Dashboard, click **New** -> **GitHub Repo** and select the same repository again.
4. Go to this new Service's **Settings** -> **Build**:
   - Set **Root Directory** to `/client`
   - Set **Build Command** to `npm run build`
   - Set **Start Command** to `npm start`
5. Go to **Settings** -> **Networking**:
   - Generate a Domain. 

## 4. Verification
1. Visit your new frontend Domain URL.
2. Sign up for a new account.
3. Check the Network tab to ensure it successfully POSTs to your backend Railway service.
4. Your application is live!
