import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { API_URL } from '../../config';

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from:', `${API_URL}/users`);
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(data.filter(u => u.email !== user.email));
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(`Failed to fetch users: ${error.message}`);
      }
    };

    fetchUsers();
  }, [user]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card">
      <div className="card-header">Users</div>
      <ul className="list-group list-group-flush">
        {users.map((u) => (
          <li
            key={u.email}
            className="list-group-item cursor-pointer hover:bg-gray-100"
            onClick={() => onUserSelect(u)}
          >
            {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;