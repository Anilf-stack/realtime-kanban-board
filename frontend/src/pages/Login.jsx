import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/api/auth/login', { email, password })
            localStorage.setItem('token', res.data.token);
            setUser({ token: res.data.token });
            navigate('/KanbanBoard');
        } catch {
            alert('Login failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password" required />
                    <button type="submit">Login</button>
                </form>
                <p>
                    Don’t have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
