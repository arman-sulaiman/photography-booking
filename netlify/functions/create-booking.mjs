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
      from: "Masruf Ifty Photography <onboarding@resend.dev>",
      to: email,
      subject: "Your Photography Booking Confirmation",
      html: `
        <h2>Booking Confirmed</h2>

        <p>Hello <b>${name}</b>,</p>

        <p>Thank you for booking with <b>Masruf Ifty Photography</b>.</p>

        <h3>Booking Details</h3>

        <table style="border-collapse:collapse;">
          <tr>
            <td><b>Package:</b></td>
            <td>${package_name}</td>
          </tr>

          <tr>
            <td><b>Shooting Date:</b></td>
            <td>${shootDate}</td>
          </tr>

          <tr>
            <td><b>Add-ons:</b></td>
            <td>${addonList}</td>
          </tr>

          <tr>
            <td><b>Total Price:</b></td>
            <td>£${total_price}</td>
          </tr>
        </table>

        <br>

        <p>We will contact you shortly to confirm the details.</p>

        <br>

        <p>Best regards,<br>
        <b>Masruf Ifty Photography</b></p>
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