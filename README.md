# CMS-Project
Complaints Management System For Graduation Project 
# 🎓 Graduation Project - Complaint Management System (CMS)

A full-stack complaint management platform built with the MERN Stack (MongoDB, Express.js, React, Node.js)

---

## 📁 Project Structure


/
├── frontend/ # React frontend application
├── backend/ # Node.js + Express backend API
├── .gitignore
├── README.md 



---

## 🔀 Git Branch Structure

| Branch      | Purpose                             |
|-------------|-------------------------------------|
| `master`    | Stable production-ready version     |
| `frontend`  | Frontend development only           |
| `backend`   | Backend development only            |
| `dev`       | Combined work from frontend/backend |

---

## 👩‍💻 Frontend Workflow

```bash
git checkout frontend


👨‍🔧 Backend Workflow
bash
Copy
Edit
git checkout backend

All backend logic and API routes live inside backend/

Use Node.js + Express with MongoDB

Configure sensitive data in .env (don't upload this file)

📥 Push Code (General Workflow)

git add .
git commit -m "your commit message"
git push origin your-branch-name

🔄 Merge Team Work into dev


git checkout dev
git merge frontend
git merge backend

node_modules
.env
*/.env


🔐 Security Guidelines
Do not commit any of the following:

Twilio Account SIDs

MongoDB URIs

JWT secrets or access tokens

Any .env files

🚀 Deployment Suggestions
Frontend: Vercel

Backend: Render or Railway
