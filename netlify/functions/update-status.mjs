import { neon } from "@netlify/neon";

export default async (req) => {
  try {
    const sql = neon();
    const { id, status } = await req.json();

    if (!id || !status) {
      return new Response(
        JSON.stringify({ error: "Missing id or status" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await sql`
      UPDATE bookings
      SET status = ${status}
      WHERE id = ${Number(id)}
    `;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
