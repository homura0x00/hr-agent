import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse} from "axios";

let cookieJar = '';

const api: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 5000,
  withCredentials: true, // 每次请求均携带 Cookie
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (cookieJar) {
    config.headers.Cookie = cookieJar;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const setCookie = response.headers['set-cookie'];
    if (setCookie) {
      cookieJar = setCookie.join('; ');
    }
    return response;
  },
  (error) => Promise.reject(error)
)

export default api