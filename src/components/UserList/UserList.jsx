import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { db } from '../../config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    console.log('Current user:', user); // Log the current user

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Snapshot received, doc count:', querySnapshot.size); // Log the number of documents

      const fetchedUsers = querySnapshot.docs
        .map(doc => {
          console.log('User doc:', doc.id, doc.data()); // Log each user document
          return { id: doc.id, ...doc.data() };
        })
        .filter(u => u.email !== user?.email);

      setUsers(fetchedUsers);
      console.log('Filtered users:', fetchedUsers); // Log the filtered users
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => unsubscribe();
  }, [user]);

  console.log('Rendering UserList, users count:', users.length); // Log before rendering

  if (users.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <p>No other users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
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