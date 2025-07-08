import React, { useState } from "react";
import './Register.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/auth/register', { username, email, password });
            navigate('/');
        } catch {
            alert('Registration failed');
        }
    };
    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" required />
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already have an account? <Link to="/">Login here</Link>
                </p>
            </div>
        </div>
    )
};

export default Register;