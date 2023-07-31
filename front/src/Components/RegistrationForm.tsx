import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../UserFunctions';

const RegisterForm: React.FC = () => {
    const nav = useNavigate();
    const [userData, setUserData] = useState({ 
        firstname: '', 
        lastname: '',
        username: '', 
        pwd: '', 
        weight: 0,
    })

    const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await registerUser({user: userData});
            alert("User registered successfully!");
            console.log(userData)
            nav('/login');
        } catch (e) {
            console.error("Error while registering", e);
            alert('Failed to register user.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData((prevUserData) => ({...prevUserData, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="firstname">First Name</label>
                <input id="firstname" name="firstname" type="text" onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor="lastname">Last Name</label>
                <input id="lastname" name="lastname" type="text" onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor="pwd">Password</label>
                <input id="pwd" name="pwd" type="password" onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor="weight">Weight (kg)</label>
                <input id="weight" name="weight" type="number" onChange={handleChange} required/>
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;