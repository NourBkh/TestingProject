import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5000/users";

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get(API_URL);
        setUsers(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await axios.put(`${API_URL}/${editingId}`, { name, email });
            setEditingId(null);
        } else {
            await axios.post(API_URL, { name, email });
        }
        setName("");
        setEmail("");
        fetchUsers();
    };

    const handleEdit = (user) => {
        setName(user.name);
        setEmail(user.email);
        setEditingId(user._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
    };

    return (
        <div className="container mt-4">
            <h2>User Management</h2>
            <form onSubmit={handleSubmit} className="mb-3">
                <input
                    type="text"
                    placeholder="Name"
                    className="form-control mb-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="form-control mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">
                    {editingId ? "Update" : "Add"} User
                </button>
            </form>
            <ul className="list-group">
                {users.map((user) => (
                    <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.name} ({user.email})
                        <div>
                            <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(user)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
