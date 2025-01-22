const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres.wewkjwtalqhjugzwrcql:_CPGJypV9RU$Nq-@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
});

export default async function handler(req, res) {
   const { score, phoneNumber } = req.body;
    const query = 'UPDATE users SET best_score = $1 WHERE phone = $2';
    const values = [score, phoneNumber];
    try {
        const response = await pool.query(query, values);
        res.json({ isUpdated: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update score' });
    }
}
