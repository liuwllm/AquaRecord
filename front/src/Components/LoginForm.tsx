import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../UserFunctions';

const LoginForm: React.FC = () => {
    const nav = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', pwd: ''});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try {
            const { user } = await loginUser({ user: credentials });
            console.log("Logged in user:", user);
            nav('/user-info', {state: user});
        } catch (e) {
            console.error("Error while logging in:", e);
            alert('Invalid credentials')
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