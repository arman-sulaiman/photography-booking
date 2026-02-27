import { neon } from '@netlify/neon';

export const handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
    const sql = neon();
    const bookings = await sql`
      SELECT *
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 200;
    `;
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookings }) };
  } catch (err) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err?.message || 'Server error' }) };
  }
};
