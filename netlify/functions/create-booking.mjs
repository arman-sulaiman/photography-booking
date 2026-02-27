import { neon } from "@netlify/neon";

export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    const sql = neon();

    // ✅ Correct: read JSON body
    const data = await req.json();

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
    } = data || {};

    // ✅ Basic validation to prevent NULL inserts
    if (!name || !phone || !email || !address || !package_name || !shooting_datetime) {
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
        ${String(name)},
        ${String(phone)},
        ${String(email)},
        ${String(address)},
        ${String(package_name)},
        ${String(total_price ?? "0")},
        ${notes ? String(notes) : ""},
        ${String(shooting_datetime)},
        ${addon_extra_edit ? String(addon_extra_edit) : "no"},
        ${extra_edit_qty ? String(extra_edit_qty) : "0"},
        ${addon_video ? String(addon_video) : "no"},
        ${addon_express ? String(addon_express) : "no"},
        ${addon_travel_outside ? String(addon_travel_outside) : "no"},
        'Pending'
      )
    `;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    // ✅ Always return JSON so frontend parsing never breaks
    return new Response(JSON.stringify({ error: err?.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
