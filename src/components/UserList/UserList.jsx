import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { db } from '../../config';
import { collection, query, onSnapshot } from 'firebase/firestore';

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'users'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(u => u.email !== user.email);
        setUsers(fetchedUsers);
      }, (error) => {
        console.error('Error fetching users:', error);
        setError(`Failed to fetch users: ${error.message}`);
      });

      return () => unsubscribe();
    }
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
            key={u.id}
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