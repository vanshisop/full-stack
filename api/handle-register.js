
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres.wewkjwtalqhjugzwrcql:_CPGJypV9RU$Nq-@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
});

export default async function handler(req, res) {
  const { best_score, name, phone } = req.body;

// Check if the user with the given phone number exists
const q1 = 'SELECT COUNT(*) > 0 AS exists FROM users WHERE phone = $1';
const r1 = await pool.query(q1, [phone]);

if (!r1.rows[0].exists) {
    // User not registered; proceed to insert
    const query = 'INSERT INTO public.users (best_score, full_name, phone) VALUES ($1, $2, $3)';
    const values = [best_score, name, phone];
    console.log(name)
    try {
        const response = await pool.query(query, values);
        if (response.rowCount > 0) {  // rowCount will be > 0 if the insert was successful
            res.json({ isRegistered: true });
        } else {
            res.json({ isRegistered: false });
        }
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'Database insert error' });
    }
} else {
    // User is already registered
    res.json({ isRegistered: false });
    }
}
