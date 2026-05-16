import axiosInstance from './axiosInstance';

export const getAllShops = () => 
    axiosInstance.get('/Shops/GetAll');

export const getShopById = (id) => 
    axiosInstance.get(`/Shops/GetById/${id}`);

export const updateShopStatus = (shopData) => 
    axiosInstance.post('/Shops/UpdateShop', shopData);