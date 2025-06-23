/// <reference types="vite/client" />
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const analyzeImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/analyze`, formData);
  return response.data;
};