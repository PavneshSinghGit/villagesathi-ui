import axiosInstance from './axiosInstance';

/**
 * Unified Login API
 * Isse Admin, Shopkeeper, aur Customer teeno login honge.
 */
export const loginUser = (credentials) => 
    axiosInstance.post('/Auth/Login', credentials); 

/**
 * Unified Register API (For Merchant/Shopkeepers)
 */
export const registerUser = (formData) => 
    axiosInstance.post('/Auth/Register', formData);

/**
 * Customer Specific Registration
 * Ye aapke 'usp_RegisterCustomer' procedure ko call karega
 */
export const registerCustomer = (formData) => 
    axiosInstance.post('/Customer/Register', formData);  

/**
 * Customer Address Management (Add, Edit, Delete, Get)
 * Ye 'usp_ManageCustomerAddress' procedure ko call karega
 * ActionType: 1-Add, 2-Update, 3-Get, 4-Delete
 */
export const manageCustomerAddress = (addressData) => 
    axiosInstance.post('/Customer/ManageAddress', addressData);

/**
 * Get Customer Profile (Optional: Agar alag se profile data chahiye)
 */
export const getCustomerProfile = (userId) => 
    axiosInstance.get(`/Customer/GetProfile/${userId}`);