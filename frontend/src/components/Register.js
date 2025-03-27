import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset previous errors
        console.log("Submitting form:", formData); // Debugging

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            console.log("Raw Response:", response); // Debugging

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message || `HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Server Response:", data); // Debugging

            if (!data.token || !data.user) {
                throw new Error('Invalid response from server');
            }

            // Store user data and JWT token
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="date" name="dob" placeholder="Date of Birth" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
