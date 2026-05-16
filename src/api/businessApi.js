import axiosInstance from './axiosInstance';

// --- Shop Items (Inventory) ---
export const getItemsByShop = (shopId) => 
    axiosInstance.get(`/ShopItems/GetByShop/${shopId}`);

export const addShopItem = (itemData) => 
    axiosInstance.post('/ShopItems/AddItem', itemData);

// --- Orders (Checkout & Management) ---
export const placeOrder = (orderData) => 
    axiosInstance.post('/Orders/PlaceOrder', orderData);

export const getOrdersByShop = (shopId) => 
    axiosInstance.get(`/Orders/GetByShop/${shopId}`);

export const getOrdersByUser = (userId) => 
    axiosInstance.get(`/Orders/GetByUser/${userId}`);

export const updateOrderStatus = (payload) => 
    axiosInstance.post('/Orders/UpdateStatus', payload);