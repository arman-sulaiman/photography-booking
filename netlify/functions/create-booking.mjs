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
      INSERT INTO bookings (
        name, phone, email, address,
        package_id, package_name, package_price,
        addon_extra_edit, extra_edit_qty,
        addon_video, addon_express, addon_travel_outside,
        notes, total_price
      ) VALUES (
        ${data.name}, ${data.phone}, ${data.email}, ${data.address},
        ${data.package_id}, ${data.package_name}, ${Number(data.package_price)},
        ${data.addon_extra_edit || 'no'}, ${Number(data.extra_edit_qty || 0)},
        ${data.addon_video || 'no'}, ${data.addon_express || 'no'}, ${data.addon_travel_outside || 'no'},
        ${data.notes || ''}, ${Number(data.total_price)}
      )
      RETURNING id, created_at;
    `;

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, booking: row }) };
  } catch (err) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err?.message || 'Server error' }) };
  }
};
