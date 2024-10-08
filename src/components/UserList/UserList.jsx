import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    // Fetch users from the server
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        setUsers(data.filter(u => u.email !== user.email));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user]);

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