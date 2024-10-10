import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { db } from '../../config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.email !== user?.email);

      setUsers(fetchedUsers);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Online Users</h2>
      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="p-2 rounded"
          >
            {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;