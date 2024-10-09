export default function handler(req, res) {
  // This is a mock user list. In a real application, you'd fetch this from a database.
  const users = [
    { email: 'user1@example.com' },
    { email: 'user2@example.com' },
    { email: 'user3@example.com' },
  ];

  res.status(200).json({ users });
}