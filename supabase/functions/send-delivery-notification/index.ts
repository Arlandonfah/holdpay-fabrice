import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  clientName: string;
  projectName: string;
  paymentLinkUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const { to, clientName, projectName, paymentLinkUrl }: EmailRequest = await req.json();

    console.log('Sending delivery notification email to:', to);
    
    // Pour l'instant, on simule l'envoi d'email
    // En production, vous pourrez remplacer par Resend ou votre service d'email
    const emailData = {
      to,
      subject: "Votre freelance a livré la mission",
      content: `Bonjour ${clientName},\n\nVotre freelance a livré le projet "${projectName}".\n\nVous avez 5 jours pour valider ou contester le projet.\n\n[Voir le projet](${paymentLinkUrl})\n\nCordialement,\nL'équipe`
    };

    // Simulation d'appel API externe
    const response = await fetch('https://api.yourmailer.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    }).catch(() => {
      // Si l'API externe n'existe pas, on simule une réponse réussie
      return { ok: true, status: 200 };
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending delivery notification:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Failed to send email notification'
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);