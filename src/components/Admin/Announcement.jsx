import React, { useState, useEffect } from 'react';
import { db } from '../../config';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Announcement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setAnnouncements(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && content) {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        createdAt: new Date()
      });
      setTitle('');
      setContent('');
      // Refresh announcements
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setAnnouncements(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Create Announcement</Button>
      </form>

      <h3 className="text-xl font-bold mt-8 mb-4">Recent Announcements</h3>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-b pb-4">
            <h4 className="text-lg font-semibold">{announcement.title}</h4>
            <p className="text-gray-600">{announcement.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {announcement.createdAt.toDate().toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;