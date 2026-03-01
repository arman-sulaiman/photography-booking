import { neon } from "@netlify/neon";

export default async (req) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Missing booking id" }),
        { status: 400 }
      );
    }

    const sql = neon();

    await sql`
      DELETE FROM bookings
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
