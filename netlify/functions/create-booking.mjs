import { neon } from "@netlify/neon";

export default async (req) => {
  try {
    const sql = neon();

    const data = await req.json();

    const {
      package_id, 
      package_price, 
      package_name,
      total_price,
      name,
      phone,
      email,
      address,
      shooting_datetime,
      notes,
      addon_extra_edit,
      extra_edit_qty,
      addon_video,
      addon_express,
      addon_travel_outside
    } = data || {};

    await sql`
      INSERT INTO bookings (
        package_id,        
        package_price,
        package_name,
        total_price,
        name,
        phone,
        email,
        address,
        shooting_datetime,
        notes,
        addon_extra_edit,
        extra_edit_qty,
        addon_video,
        addon_express,
        addon_travel_outside,
        status
      )
      VALUES (
        ${package_id},     
        ${package_name},
        ${package_price},
        ${total_price},
        ${name},
        ${phone},
        ${email},
        ${address},
        ${shooting_datetime},
        ${notes || ""},
        ${addon_extra_edit || "no"},
        ${extra_edit_qty || "0"},
        ${addon_video || "no"},
        ${addon_express || "no"},
        ${addon_travel_outside || "no"},
        'Pending'
      )
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
