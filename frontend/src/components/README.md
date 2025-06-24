Instructions as to how to start:
1. Start the FastAPI Backend
a. Set your Google API key in the terminal:

$env:GOOGLE_API_KEY="AIzaSyB_VQfUXSX6rX0yWRI_Hn9GeWew7Gt2ZH8"

b. Navigate to your backend folder:

cd backend

c. Start the backend server:

python -m uvicorn main:app --reload

2. Start the Vite React Frontend
a. Open a new terminal

cd frontend

b. Start the frontend:

npm run dev

You should see:
Local: http://localhost:5173/


for reset from github:

git fetch origin
git reset --hard origin/main

for github push:

git add .
git commit -m "Your commit message"
git push origin main

force push:

git add .
git commit -m "Your commit message"
git push origin main --force