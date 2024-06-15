import api from './Api';
import {jwtDecode} from "jwt-decode"


export const loginAdminApi = async (email, password) => {
  try {
    const apiInst = api();
    const response = await apiInst.post('/v1/admin/login', {
      email,
      password
    });
    return response;
  } catch (error) {
    console.error('Error in loginAdminApi:', error);
    throw error;  
  }
};

export const decodeToken = async(token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error in decodeToken:', error);
    throw error;
  }
};

export const getaAdmins = async() => {
  try {
    const apiInst = api();
    const response = await apiInst.get('./v1/admin');
    return response;
  } catch (error) {
    console.error('Error in getaAdmins:', error);
    throw error;
  }
};

export const getSupervisors = async() => {
  try {
    const apiInst = api();
    const response = await apiInst.get('./v1/supervisor');
    return response;
  } catch (error) {
    console.error('Error in getSupervisors:', error);
    throw error;
  }
};

export const getManagers = async() => {
  try {
    const apiInst = api();
    const response = await apiInst.get('./v1/manager');
    return response;
  } catch (error) {
    console.error('Error in getManagers:', error);
    throw error;
  }
};
