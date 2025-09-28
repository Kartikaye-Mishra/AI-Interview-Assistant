import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Resume parsing
export const parseResumeAPI = (file: File) => {
  const formData = new FormData();
  formData.append("resume", file);

  return axiosInstance.post(import.meta.env.VITE_RESUME_PARSE_ENDPOINT!, formData);
};
