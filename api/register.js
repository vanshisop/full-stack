const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres.wewkjwtalqhjugzwrcql:_CPGJypV9RU$Nq-@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
});

export default async function handler(req, res) {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract phoneNumber from the body
  const { phoneNumber } = req.body;

  // Check if phoneNumber is provided
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Check if the user exists
    const query = 'SELECT COUNT(*) > 0 AS exists FROM users WHERE phone = $1';
    const response = await pool.query(query, [phoneNumber]);

    // If user does not exist
    if (!response.rows[0].exists) {
      return res.json({ isRegistered: false });
    }

    // If user exists, fetch their full name and best score
    const userQuery = 'SELECT full_name, best_score FROM users WHERE phone = $1';
    const userResponse = await pool.query(userQuery, [phoneNumber]);

    if (userResponse.rows.length > 0) {
      const userName = userResponse.rows[0].full_name;
      const bestScore = userResponse.rows[0].best_score;

      // Return the user data
      return res.json({
        isRegistered: true,
        user: userName,
        best_score: bestScore,
        phoneNumber, // Return the phoneNumber
      });
    } else {
      return res.status(404).json({ error: 'User data not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
