import axios from "axios";

function getToken() {
  return import.meta.env.VITE_API_TOKEN;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL /* + "/api" */,
  timeout: 600000,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export { api };
