import { privateApi } from './axios';

const user = async () => {
  try {
    const response = await privateApi.get('/user');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

const accumulate = async (data) => {
  try {
    const response = await privateApi.post('/user/accumulatePoints',data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

export { user, accumulate };
