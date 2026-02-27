import { neon } from "@netlify/neon";

export default async (req) => {
  try {
    const sql = neon();

    // Netlify often provides req.body as a STRING
    const data =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

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

    // Basic validation (prevents NULL insert)
    if (!name || !phone || !email || !address || !package_name || !total_price || !shooting_datetime) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

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
        ${package_name}, ${total_price}, ${notes || ""},
        ${shooting_datetime},
        ${addon_extra_edit || "no"}, ${extra_edit_qty || "0"},
        ${addon_video || "no"}, ${addon_express || "no"},
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
