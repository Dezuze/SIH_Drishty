# KisanDirect Deployment Guide (Vercel & Render)

This project is configured to run effortlessly in three different hosting setups:
1. **All-in-One on Vercel** (Frontend + Serverless Express API)
2. **All-in-One on Render** (Single Node.js Web Service)
3. **Decoupled Architecture** (Frontend on Vercel + Backend on Render)

---

## Pre-Deployment Verification

Verify your project compiles cleanly:
```bash
# 1. Build the production frontend
npm run build

# 2. Test the production server locally
npm start
# Visit http://localhost:5000/ to confirm both UI and /api/health work
```

---

## Option 1: Deploy on Vercel (Recommended & Fast)

Deploy both the React frontend and the Express API serverlessly on Vercel.

### Step-by-Step Instructions

1. **Push your code to GitHub / GitLab / Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** &rarr; **"Project"**.
4. Import your **SIH_Drishty** (or KisanDirect) repository.
5. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Deploy**.

### How it works on Vercel:
- **[vercel.json](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/vercel.json)** handles:
  - All `/api/*` routes are routed to [api/index.js](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/api/index.js) (serverless Express function).
  - All other routes (`/profile`, `/driver`, `/tracking/*`, `/vendor`) route to `/index.html` (prevents 404s on browser refresh).
  - Database operations safely write to `/tmp` in serverless memory without filesystem permission errors.

---

## Option 2: Deploy on Render (All-in-One Full-Stack Web Service)

Deploy the entire app (Node Express server serving both the API and the pre-built React frontend) as a single free Web Service on Render.

### Method A: Blueprint 1-Click Deploy (Using `render.yaml`)
1. Push your repository to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com).
3. Click **"New +"** &rarr; **"Blueprint"**.
4. Connect your repository.
5. Render reads [render.yaml](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/render.yaml) and automatically configures:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check**: `/api/health`
6. Click **Apply**.

### Method B: Manual Web Service Setup
1. On Render, click **"New +"** &rarr; **"Web Service"**.
2. Select your repository.
3. Settings:
   - **Name**: `kisandirect-web`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Click **Create Web Service**.

Your entire app, database, and APIs will be live on `https://your-app.onrender.com`.

---

## Option 3: Decoupled Deploy (Vercel Frontend + Render Backend)

If you prefer hosting the backend Express server on Render and the frontend on Vercel:

### 1. Deploy the Backend on Render
1. Click **"New +"** &rarr; **"Web Service"** on Render.
2. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Health Check Path**: `/api/health`
3. Copy your live Render URL (e.g. `https://kisandirect-api.onrender.com`).

### 2. Deploy the Frontend on Vercel
1. Import repository to Vercel.
2. In **Project Settings** &rarr; **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://kisandirect-api.onrender.com` (your Render URL)
3. Click **Deploy**.

[src/services/api.ts](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/src/services/api.ts) automatically detects `VITE_API_URL` and points all API requests to your Render backend while retaining offline fallback capabilities.

---

## Deployment Configuration Files Summary

| File | Purpose |
| :--- | :--- |
| **[vercel.json](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/vercel.json)** | Configures Vercel rewrites for SPA client-side routing & serverless API execution |
| **[api/index.js](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/api/index.js)** | Vercel serverless function entrypoint running the Express application |
| **[render.yaml](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/render.yaml)** | Infrastructure as Code blueprint for 1-click Render web service deployment |
| **[server/index.js](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/server/index.js)** | Express 5 server with fallback `/tmp` storage and static `dist/` bundle hosting |
| **[package.json](file:///c:/Users/wesly/Documents/Coding/SIH_Drishty/package.json)** | Contains `"start": "node server/index.js"` and build scripts for cloud hosts |
