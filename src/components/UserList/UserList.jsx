import React, { useState, useEffect } from 'react';
import { db } from '../../config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Group Members</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 rounded bg-gray-100"
          >
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;