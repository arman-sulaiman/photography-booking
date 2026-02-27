import { neon } from '@netlify/neon';

export default async (req) => {
  const sql = neon();
  const { id, status } = JSON.parse(req.body);

  await sql`
    UPDATE bookings
    SET status = ${status}
    WHERE id = ${id}
  `;

  return new Response(JSON.stringify({success:true}), {
    headers: { "Content-Type": "application/json" }
  });
};
