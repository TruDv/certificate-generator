// Located at: supabase/functions/send-feedback-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipientEmail, recipientName } = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // IMPORTANT: Replace 'yourdomain.com' with the domain you verified in Resend.
        // For example: 'noreply@kilalitribe.com'
        from: 'Kilali Tribe <noreply@certs.kilalitribe.com>', 
        to: [recipientEmail],
        subject: 'Thank You for Your Feedback!',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Dear ${recipientName},</h2>
            <p>Thank you for submitting your feedback for the <strong>Kilali Tribe Conference 2025.</strong></p>
            <p>We have received your submission successfully. You can now return to the cert page to download your official Certificate of Participation.</p>
            <p style="margin-top: 30px;"><a href="${req.headers.get('origin')}" style="background-color: #8B0000; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Download Your Certificate</a></p>
            <br>
            <p>Best regards,</p>
            <p><strong>The Kilali Tribe Team</strong></p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
        throw new Error(`Resend API Error: ${await response.text()}`);
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
  }
})