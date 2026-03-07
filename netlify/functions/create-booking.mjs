import { neon } from "@netlify/neon";
import { Resend } from "resend";

const resend = new Resend(process.env.re_ediBExNq_JjtJQxgGk6e1dHg7K3akPa2H);

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

    // Insert booking into database
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
        ${package_price},
        ${package_name},
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

    // Build addon summary
    let addons = [];

    if (addon_extra_edit === "yes") {
      addons.push(`Extra Edit (${extra_edit_qty} photos)`);
    }

    if (addon_video === "yes") {
      addons.push("Video Reel");
    }

    if (addon_express === "yes") {
      addons.push("Express Delivery");
    }

    if (addon_travel_outside === "yes") {
      addons.push("Travel Outside City");
    }

    const addonList = addons.length ? addons.join(", ") : "None";

    // Format date
    const shootDate = shooting_datetime
      ? new Date(shooting_datetime).toLocaleString()
      : "Not specified";

    // Send confirmation email
    await resend.emails.send({
  from: "Masruf Ifty Photography <noreply@masruf-ifty.me>",
  to: email,
  subject: "Booking Confirmation – Masruf Ifty Photography",
  html: `
  <div style="background:#0f172a;padding:40px 20px;font-family:Arial,sans-serif;color:#e2e8f0;">
  
    <div style="max-width:600px;margin:auto;background:#020617;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">
      
      <!-- Header -->
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#34d399,#22d3ee);margin-right:12px;"></div>
        <div>
          <div style="font-size:12px;color:#94a3b8;">MASRUF IFTY</div>
          <div style="font-size:16px;font-weight:bold;">Photography</div>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:28px;">

        <h2 style="margin-top:0;color:#ffffff;font-size:22px;">
          Booking Confirmed
        </h2>

        <p style="color:#cbd5f5;">
          Hi <strong>${name}</strong>,  
          <br><br>
          Thank you for booking with <strong>Masruf Ifty Photography</strong>.  
          Your request has been received and we will contact you shortly.
        </p>

        <!-- Booking card -->
        <div style="background:#0f172a;border-radius:12px;padding:20px;margin-top:20px;border:1px solid rgba(255,255,255,0.08);">

          <table style="width:100%;font-size:14px;border-collapse:collapse;color:#e2e8f0;">
            
            <tr>
              <td style="padding:6px 0;color:#94a3b8;">Package</td>
              <td style="text-align:right;font-weight:600;">${package_name}</td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#94a3b8;">Shooting Date</td>
              <td style="text-align:right;font-weight:600;">${shootDate}</td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#94a3b8;">Add-ons</td>
              <td style="text-align:right;">${addonList}</td>
            </tr>

            <tr>
              <td style="padding:10px 0;color:#94a3b8;">Total</td>
              <td style="text-align:right;font-weight:bold;color:#34d399;font-size:16px;">
                £${total_price}
              </td>
            </tr>

          </table>

        </div>

        <!-- Notes -->
        ${
          notes
            ? `
        <div style="margin-top:20px;color:#cbd5f5;">
          <strong>Client Notes</strong>
          <p style="margin-top:6px;">${notes}</p>
        </div>
        `
            : ""
        }

        <!-- Footer message -->
        <p style="margin-top:28px;color:#cbd5f5;">
          If you need to update anything regarding your booking, feel free to reply to this email.
        </p>

        <p style="margin-top:20px;">
          Best regards,<br>
          <strong>Masruf Ifty Photography</strong>
        </p>

      </div>

      <!-- Footer -->
      <div style="padding:20px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid rgba(255,255,255,0.08);">
        © ${new Date().getFullYear()} Masruf Ifty Photography
      </div>

    </div>
  </div>
  `
});

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