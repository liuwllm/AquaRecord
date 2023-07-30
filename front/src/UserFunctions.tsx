import axios, { AxiosResponse } from 'axios';
import { UserInfo, UserCredentials, UserRegistration } from "./Interface.js"

const BASE_URL = 'http://localhost:5000/api';

const API_ENDPOINTS = {
    login: '/login',
    register: '/register',
};

const api = axios.create({
    baseURL: BASE_URL,
});

export const loginUser = async (credentials: UserCredentials): Promise<UserInfo> => {
    const response: AxiosResponse<UserInfo> =  await api.post(API_ENDPOINTS.login, credentials.user);
    return response.data;
};

export const registerUser = async (userInfo: UserRegistration): Promise<void> => {
    await api.post(API_ENDPOINTS.register, userInfo.user)
}