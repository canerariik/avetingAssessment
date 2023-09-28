import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Users() {
    const [data, setData] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', isLogged: false, id: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.isLogged) {
            navigate("/");
        } else {
            start();
        }
    }, [navigate]);

    const start = async () => {
        axios.get('http://127.0.0.1:8000/users')
            .then(res => {
                setData(res.data);
            })
            .catch(error => {
                console.log("aasdadasd", error);
            });
    };

    const postUser = async () => {
        axios.post('http://127.0.0.1:8000/users', newUser)
            .then((response) => {
                debugger
                setData([...data, response.data]);
                setNewUser({ username: '', email: '', password: '', isLogged: false, id: '' });
                start()
                setShowCreateModal(false);
            })
            .catch((error) => {
                debugger
                setError("Kayıt işlemi başarısız, bu bilgilere ait kullanıcı mevcut.");
            });

        start()
    };

    const updateUser = () => {
        axios.put(`http://127.0.0.1:8000/users/${editingUser.id}`, editingUser)
            .then(() => {
                const updatedUsers = data.map((item) => {
                    if (item.id === editingUser.id) {
                        return editingUser;
                    }
                    return data;
                });
                setData(updatedUsers);
                setEditingUser(null);
                start()
                handleClose()
            })
            .catch((error) => {
                setError("Güncelleme işlemi başarısız, bu bilgilere ait kullanıcı mevcut.");
            });

        start()
    };

    const deleteUser = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.id !== id) {
            axios.delete(`http://127.0.0.1:8000/users/${id}`)
                .then(() => {
                    const updatedUsers = data.filter((item) => item.id !== id);
                    setData(updatedUsers);
                }).catch((error) => {
                    console.log("erroe", error)
                })
        } else {
            alert("Oturumu açık olan kullanıcı kendi bilgilerini silemez.")
        }
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
    };

    const handleClose = () => {
        setEditingUser();
    };

    const filterData = () => {
        return data.filter((item) =>
            item.username.toLowerCase().includes(search.toLowerCase())
        );
    };

    const logout = () => {

        debugger
        const user = JSON.parse(localStorage.getItem("user"));
        axios.post('http://127.0.0.1:8000/logout', {
            username: user.username,
        })
            .then(res => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].username === user.username) {
                        data[i].isLogged = false;
                    };
                }

                debugger
                setData([...data, res.data]);
                localStorage.clear("user");
                navigate("/");
            })
            .catch(error => {
                console.log("Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.");
            });
    };

    return (
        <div className='container'>
            <div className="d-flex justify-content-between mt-5">
                <h2>Users Table</h2>
                <Button variant="success" onClick={() => setShowCreateModal(true)}>Create User</Button>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search by username"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filterData().map((item) => (
                        <tr key={item.id}>
                            <td>{item.username}</td>
                            <td>{item.email}</td>
                            <td>
                                <Button variant="info" onClick={() => handleEditClick(item)}>Edit</Button>
                                <Button variant="danger" onClick={() => deleteUser(item.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Button variant="danger" onClick={logout}>Logout</Button>

            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                    {error && <p className='text-danger'>{error}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateModal}>Close</Button>
                    <Button variant="primary" onClick={postUser}>Create</Button>
                </Modal.Footer>
            </Modal>

            {editingUser && (
                <Modal show={editingUser !== null} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    value={editingUser.username}
                                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    {error && <p className='text-danger'>{error}</p>}
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={updateUser}>Update</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default Users;
