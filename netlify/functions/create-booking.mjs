import { neon } from "@netlify/neon";

export default async (req) => {
  try {
    const sql = neon();

    // ✅ DO NOT JSON.parse
    const data = req.body;

    const {
      name,
      phone,
      email,
      address,
      package_name,
      total_price,
      notes,
      shooting_datetime,
      addon_extra_edit,
      extra_edit_qty,
      addon_video,
      addon_express,
      addon_travel_outside
    } = data;

    await sql`
      INSERT INTO bookings (
        name, phone, email, address,
        package_name, total_price, notes,
        shooting_datetime,
        addon_extra_edit, extra_edit_qty,
        addon_video, addon_express,
        addon_travel_outside,
        status
      )
      VALUES (
        ${name}, ${phone}, ${email}, ${address},
        ${package_name}, ${total_price}, ${notes},
        ${shooting_datetime},
        ${addon_extra_edit}, ${extra_edit_qty},
        ${addon_video}, ${addon_express},
        ${addon_travel_outside},
        'Pending'
      )
    `;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500
    });
  }
};
