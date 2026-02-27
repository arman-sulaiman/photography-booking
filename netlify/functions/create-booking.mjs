import { neon } from "@netlify/neon";

export default async (req) => {
  try {
    const sql = neon();
    const body = JSON.parse(req.body);

    await sql`
      INSERT INTO bookings (
        name,
        phone,
        email,
        address,
        package_id,
        package_name,
        package_price,
        addon_extra_edit,
        extra_edit_qty,
        addon_video,
        addon_express,
        addon_travel_outside,
        notes,
        total_price,
        shooting_datetime,
        status
      )
      VALUES (
        ${body.name},
        ${body.phone},
        ${body.email},
        ${body.address},
        ${body.package_id},
        ${body.package_name},
        ${body.package_price},
        ${body.addon_extra_edit},
        ${body.extra_edit_qty},
        ${body.addon_video},
        ${body.addon_express},
        ${body.addon_travel_outside},
        ${body.notes},
        ${body.total_price},
        ${body.shooting_datetime},
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
