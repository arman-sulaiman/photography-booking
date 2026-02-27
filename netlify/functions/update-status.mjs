import { neon } from '@netlify/neon';

export default async (req) => {
  try {
    const sql = neon();
    const { id, status } = JSON.parse(req.body);

    if (!id || !status) {
      return new Response(
        JSON.stringify({ error: "Missing id or status" }),
        { status: 400 }
      );
    }

    await sql`
      UPDATE bookings
      SET status = ${status}
      WHERE id = ${id}
    `;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
};
