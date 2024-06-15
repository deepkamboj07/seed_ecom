import axios from 'axios';
import config from '../config';



export default () => {
    return axios.create({
      baseURL: config.PUBLIC_API_URL
    });
};

export const tokenApi = (token) => {
  if (token) {
    return axios.create({
      baseURL: config.PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};

export const tokenApiForm = (token) => {
  if (token) {
    return axios.create({
      baseURL: config.PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};
