import React, { useState, useEffect } from 'react';
import { db } from '../../config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setAnnouncements(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-b pb-4">
            <h3 className="text-xl font-semibold">{announcement.title}</h3>
            <p className="text-gray-600 mt-2">{announcement.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {announcement.createdAt.toDate().toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAnnouncements;