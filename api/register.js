const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres.wewkjwtalqhjugzwrcql:_CPGJypV9RU$Nq-@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
});

export default async function handler(req, res) {
  // Handle CORS for preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://my-guessing-number-lbhc.vercel.app'); // Allow your frontend domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    return res.status(200).end(); // Respond with a 200 for the preflight request
  }

  // Handle POST request (your main API logic)
  if (req.method === 'POST') {
    res.setHeader('Access-Control-Allow-Origin', 'https://my-guessing-number-lbhc.vercel.app'); // Allow your frontend domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers

    const { phoneNumber } = req.body; // Extract phoneNumber from the body

    const query = 'SELECT COUNT(*) > 0 AS exists FROM users WHERE phone = $1';
    const response = await pool.query(query, [phoneNumber]); // Pass phoneNumber as an array

    if (response.rows[0].exists) {
      // If user exists, fetch their name and best score
      const userQuery = 'SELECT full_name, best_score FROM users WHERE phone = $1';
      const userResponse = await pool.query(userQuery, [phoneNumber]); // Pass phoneNumber as an array

      if (userResponse.rows.length > 0) {
        const userName = userResponse.rows[0].full_name;
        const bestScore = userResponse.rows[0].best_score;

        return res.json({
          isRegistered: true,
          user: userName,
          best_score: bestScore,
          phoneNumber, // Return the phoneNumber
        });
      }
    } else {
      return res.json({ isRegistered: false });
    }
  } else {
    // If the request method is not POST or OPTIONS, return Method Not Allowed
    res.setHeader('Access-Control-Allow-Origin', 'https://my-guessing-number-lbhc.vercel.app');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
