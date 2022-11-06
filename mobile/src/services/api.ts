import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_SERVER_BASE_URL
});