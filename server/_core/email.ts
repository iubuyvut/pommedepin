import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface ReservationEmailData {
  email: string;
  name: string;
  date: string;
  time: string;
  guests: number;
}

export async function sendReservationEmail(data: ReservationEmailData) {
  const { email, name, date, time, guests } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #333; margin: 0; font-size: 28px; }
          .header p { color: #666; margin: 5px 0 0 0; }
          .details { background: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #666; font-weight: bold; }
          .detail-value { color: #333; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .cta-button { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Réservation Confirmée</h1>
            <p>La Pomme de Pin - Pizzeria Artisanale à Uccle</p>
          </div>

          <p>Bonjour <strong>${name}</strong>,</p>
          <p>Merci de votre réservation ! Nous avons le plaisir de vous accueillir à La Pomme de Pin.</p>

          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${formatDate(date)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Heure</span>
              <span class="detail-value">${time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nombre de convives</span>
              <span class="detail-value">${guests} personne${guests > 1 ? 's' : ''}</span>
            </div>
          </div>

          <p>Nous vous attendons avec plaisir ! Si vous avez besoin de modifier ou annuler votre réservation, n'hésitez pas à nous contacter au <strong>02 374 27 36</strong>.</p>

          <p><strong>Adresse :</strong><br>
          Chp du Vert Chasseur 87<br>
          1180 Uccle</p>

          <p><strong>Horaires :</strong><br>
          Lundi : Fermé<br>
          Mardi - Dimanche : 19:00 - 22:30 (23:00 le vendredi et samedi)</p>

          <div class="footer">
            <p>© 2026 La Pomme de Pin. Tous droits réservés.</p>
            <p>Cet e-mail a été envoyé à ${email}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!process.env.SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured, skipping email send");
    return;
  }

  if (!process.env.EMAIL_USER) {
    console.warn("[Email] Sender email not configured, skipping email send");
    return;
  }

  try {
    await sgMail.send({
      to: email,
      from: process.env.EMAIL_USER,
      subject: `Confirmation de réservation - La Pomme de Pin - ${date} à ${time}`,
      html: htmlContent,
    });
    console.log(`[Email] Reservation confirmation sent to ${email}`);
  } catch (error) {
    console.error("[Email] Failed to send reservation confirmation:", error);
    throw error;
  }
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('fr-FR', options);
}
