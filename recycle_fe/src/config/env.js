
const apiUrl = import.meta.env.VITE_SERVER_URL;

const server = apiUrl;
const ENV = {
  API_BASE_URL: `${server}/api`,
  SOCKET_BASE_URL: `${server}`
};

export default ENV;
