import { neon } from '@netlify/neon';

export const handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
    const data = JSON.parse(event.body || '{}');
    const required = ['name','phone','email','address','package_id','package_name','package_price','total_price'];
    for (const k of required) {
      if (!data[k] || String(data[k]).trim() === '') {
        return { statusCode: 400, body: JSON.stringify({ error: `Missing field: ${k}` }) };
      }
    }

    const sql = neon(); // uses NETLIFY_DATABASE_URL
    const [row] = await sql`
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
      RETURNING id, created_at;
    `;

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, booking: row }) };
  } catch (err) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err?.message || 'Server error' }) };
  }
};
