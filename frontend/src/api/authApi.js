import axiosClient from './axiosClient';

const authApi = {
  signup(data) {
    return axiosClient.post('/signup', data);
  },
  login(data) {
    return axiosClient.post('/login', data);
  }
};

export default authApi;