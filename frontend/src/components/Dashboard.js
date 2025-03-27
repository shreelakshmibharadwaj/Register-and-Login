import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/');
        } else {
            setUserData(JSON.parse(storedUser).user);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome, {userData?.name}</h2>
            <button onClick={handleLogout}>Logout</button>
            

            <table>
                <thead>
                    <tr>
                        <th>Sl no.</th>
                        <th>Name</th>
                        <th>Date Created</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Michael Holz</td>
                        <td>04/10/2013</td>
                        <td>Admin</td>
                        <td className="status active">Active</td>
                        <td>❌</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Paula Wilson</td>
                        <td>05/08/2014</td>
                        <td>Publisher</td>
                        <td className="status active">Active</td>
                        <td>❌</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Antonio Moreno</td>
                        <td>11/05/2015</td>
                        <td>Publisher</td>
                        <td className="status suspended">Suspended</td>
                        <td>❌</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
