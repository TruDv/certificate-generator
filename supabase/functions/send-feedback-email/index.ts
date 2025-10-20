// Located at: supabase/functions/send-feedback-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName } = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in Supabase secrets.");
    }
    
    // --- THIS IS THE CORRECT LOGIC ---
    // Construct the URL with parameters. encodeURIComponent ensures names with spaces work correctly.
    const origin = req.headers.get('origin') || 'https://certs.kilalitribe.com'; // Fallback just in case
    const downloadLink = `${origin}?status=success&name=${encodeURIComponent(recipientName)}&email=${encodeURIComponent(recipientEmail)}`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Kilali Tribe <noreply@certs.kilalitribe.com>',
        to: [recipientEmail],
        subject: 'Thank You for Your Feedback!',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Dear ${recipientName},</h2>
            <p>Thank you for submitting your feedback for the <strong>Kilali Tribe Conference 2025.</strong></p>
            <p>We have received your submission successfully. You can now download your official Certificate of Participation by clicking the button below.</p>
            <p style="margin-top: 30px;"><a href="${downloadLink}" style="background-color: #8B0000; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Download Your Certificate</a></p>
            <br>
            <p>Best regards,</p>
            <p><strong>The Kilali Tribe Team</strong></p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
        throw new Error(`Resend API Error: ${await response.text()}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
  }
});