import axios from 'axios';
import { api,privateApi } from '../../api/axios';


const loginAPI = async (username, password) => {
  try {
    const response = await api.post('/auth/sign-in', { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

export default loginAPI;
