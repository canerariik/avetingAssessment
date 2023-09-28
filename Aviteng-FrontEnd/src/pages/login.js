import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear("user");
        navigate("/");
    }, [navigate]);

    const login = async () => {
        await axios.post('http://127.0.0.1:8000/login', {
            username: username,
            password: password,
        })
            .then(res => {
                if (res.data.isLogged === false) {
                    res.data.isLogged = true;
                }

                localStorage.setItem("user", JSON.stringify(res.data));

                if (res.data === false) {
                    navigate('/');
                }
                navigate('/users');
            })
            .catch(error => {
                setError("Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.");
            });
    };

    return (
        <div className='container d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
            <div className='col-md-4'>
                <h2 className='text-center mb-4'>Login Page</h2>
                <Form>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                </Form>
                {error && <p className='text-danger'>{error}</p>}
                <Button variant="success" onClick={login} className='w-100 mt-3'>Login</Button>
            </div>
        </div>
    );
}

export default Login;
