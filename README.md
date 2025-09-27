# ResuMatch
---
**ResuMatch** is an AI-powered resume analysis application that compares resumes against job descriptions using Google’s Gemini (Generative AI) API. It highlights matching skills, identifies missing skills, and provides personalized improvement suggestions. The project consists of a **FastAPI backend** and a **React + Vite frontend**, fully containerized with Docker.

---

## Features

- AI-based resume analysis using Google Gemini API  
- Highlights **matching skills** and **missing skills**  
- Provides **personalized improvement suggestions**  
- Fully containerized with Docker  
- FastAPI backend + React frontend  

---

## Tech Stack

- **Backend:** Python 3.11, FastAPI, Uvicorn, Docker  
- **Frontend:** React, Vite, Tailwind CSS  
- **APIs:** Google Gemini / Generative AI  
- **Deployment:** Docker Compose  

---

## Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) installed  
- Google Cloud API Key with access to Gemini API  

---

## Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/resumatch.git
cd resumatch
```

### 2️⃣ Create environment variables
Create a .env file in the backend directory:
```
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

 ### 3️⃣ Build and run the application using Docker Compose
```sh
docker-compose up --build
```
 - Backend will be accessible at: http://localhost:8000

 - Frontend will be accessible at: http://localhost:3000

⚠️ Make sure the backend port 8000 is exposed. React frontend calls backend at http://localhost:8000 in development.

 ### 4️⃣ Using the Application
 - Open http://localhost:3000 in your browser.
 - Upload a resume and a job description.
 - See the AI-powered analysis, including:
   - Match percentage
   - Matching skills
   - Missing skills
   - Suggestions for improvement