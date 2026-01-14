import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, email, data } = await req.json();

    if (!email || !type) {
      throw new Error('Missing email or type');
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      throw new Error('Email service configuration missing');
    }

    let subject = '';
    let html = '';

    switch (type) {
      case 'order_confirmation':
        subject = `Order Confirmation - Order #${data.orderId}`;
        html = generateOrderConfirmationHtml(data);
        break;
      case 'status_update':
        subject = `Order Update - Order #${data.orderId}`;
        html = generateStatusUpdateHtml(data);
        break;
      default:
        throw new Error('Invalid email type');
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Marjahan's Jewelry <noreply@marjahans.com>",
        to: email,
        subject: subject,
        html: html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to send email');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

function generateOrderConfirmationHtml(data: any) {
  const { orderId, customerName, total, status } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f6f6f6; padding: 20px;">
      <div style="background: white; padding: 40px; border-radius: 8px;">
        <h1 style="color: #8B5A3C; text-align: center;">Thank You for Your Order!</h1>
        <p>Dear ${customerName || 'Valued Customer'},</p>
        <p>Your luxury jewelry order has been confirmed. Here are the details:</p>

        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Order #${orderId}</h3>
          <p><strong>Total:</strong> $${Number(total).toFixed(2)}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>

        <p>You will receive another email when your order ships.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://marjahans.com/orders/${orderId}"
             style="background: #8B5A3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Track Your Order
          </a>
        </div>

        <p>Best regards,<br>The Marjahan's Jewelry Team</p>
      </div>
    </div>
  `;
}

function generateStatusUpdateHtml(data: any) {
  const { orderId, customerName, newStatus, trackingNumber } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f6f6f6; padding: 20px;">
      <div style="background: white; padding: 40px; border-radius: 8px;">
        <h1 style="color: #8B5A3C; text-align: center;">Order Status Update</h1>
        <p>Dear ${customerName || 'Valued Customer'},</p>
        <p>Your order status has been updated to: <strong>${newStatus}</strong></p>

        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Order #${orderId}</h3>
          <p><strong>New Status:</strong> ${newStatus}</p>
          ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
        </div>

        <p>Best regards,<br>The Marjahan's Jewelry Team</p>
      </div>
    </div>
  `;
}
