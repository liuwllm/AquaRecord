import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const BASE_URL = 'http://localhost:5000/api';

const API_ENDPOINTS = {
    login: '/login',
    register: '/register',
};

const api = axios.create({
    baseURL: BASE_URL,
});

const LoginForm: React.FC = () => {
    const nav = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', pwd: ''});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const login_res = await axios.post("http://localhost:5000/api/login", credentials, {withCredentials: true});
        if (login_res.data.authenticated) {
            const res = await axios.get("http://localhost:5000/api/user-info", {withCredentials: true});
            nav('/user-info', {state: res.data});
        } else {
            alert(login_res.data.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value}));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor="pwd">Password</label>
                <input id="pwd" name="pwd" type="password" onChange={handleChange} required/>
            </div>

            <button type="submit">Login</button>
        </form>
    )
}

export default LoginForm