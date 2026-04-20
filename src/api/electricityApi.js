import axiosInstance from './axiosInstance';

export const electricityApi = {
    // Location Hierarchy
    getCountries: () => axiosInstance.get('/Electricity/location/countries'),
    getStates: (countryId) => axiosInstance.get(`/Electricity/location/states/${countryId}`),
    getDistricts: (stateId) => axiosInstance.get(`/Electricity/location/districts/${stateId}`),
    getSupplyCenters: (districtId) => axiosInstance.get(`/Electricity/supply-centers/${districtId}`),
    getVillages: (centerId) => axiosInstance.get(`/Electricity/villages/${centerId}`),

    // Status & History
    getCurrentStatus: () => axiosInstance.get('/Electricity/status'),
    getHistory: (villageId) => axiosInstance.get(`/Electricity/history/${villageId}`),
    saveStatus: (data) => axiosInstance.post('/Electricity/save-status', data)
};