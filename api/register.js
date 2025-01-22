const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres.wewkjwtalqhjugzwrcql:_CPGJypV9RU$Nq-@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
});

export default async function handler(req, res) {

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

}
