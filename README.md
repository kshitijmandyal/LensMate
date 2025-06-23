# LensMate
Upload photos for instant AI analysis on composition, lighting, and ways to improve your photography.


---

## Features

- Drag-and-drop image upload
- AI-powered feedback on technical and artistic aspects
- Visual rating bars and improvement suggestions
- Responsive, modern UI

---

## Folder Structure

```
react-lensmate/
├── backend/      # FastAPI backend
│   ├── main.py
│   └── ...
├── frontend/     # React + Vite frontend
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── ...
```

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/react-lensmate.git
cd react-lensmate
```

---

### 2. Backend Setup

1. **Set your Google API key:**

   For PowerShell:
   ```sh
   $env:GOOGLE_API_KEY="your-google-api-key"
   ```

   For CMD:
   ```sh
   set GOOGLE_API_KEY=your-google-api-key
   ```

2. **Navigate to the backend folder:**
   ```sh
   cd backend
   ```

3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Start the backend server:**
   ```sh
   python -m uvicorn main:app --reload
   ```

---

### 3. Frontend Setup

1. **Open a new terminal and navigate to the frontend folder:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set the backend API URL:**

   Create a `.env` file in the `frontend` folder with:
   ```
   VITE_API_URL=http://localhost:8000
   ```
   (Or use your deployed backend URL.)

4. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```

5. **Open [http://localhost:5173/](http://localhost:5173/) in your browser.**

---

## Deployment

- Deploy the backend (FastAPI) to a cloud provider (e.g., Render, Railway, Azure, AWS).
- Deploy the frontend (React) to a static host (e.g., Vercel, Netlify).
- Update the `VITE_API_URL` in the frontend `.env` to point to your deployed backend.

---

## License

MIT

---

## Credits

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
-
