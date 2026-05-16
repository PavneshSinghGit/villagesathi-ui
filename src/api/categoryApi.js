import axiosInstance from './axiosInstance';

export const getCategories = () => 
    axiosInstance.get('/Categories/GetAll');