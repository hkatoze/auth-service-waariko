export const resetPasswordTemplate = (fullname: string, otp: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Réinitialisation mot de passe</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
    
    <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:8px; overflow:hidden;">
      
      <!-- HEADER -->
      <tr>
        <td style="background-color:#c09544; padding:20px; text-align:left;">
            <img 
                src="https://ucarecdn.com/2a3ca8c3-3b03-4e5b-824d-09ebb3c2bd02/-/preview/532x118/" 
                alt="Waariko Logo" 
                width="160"
                style="display:block;"
            />
        </td>
       </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
          
          <p>Cher(e) ${fullname},</p>

          <p>
            Vous avez récemment demandé à réinitialiser votre mot de passe.
            Pour compléter cette procédure, veuillez utiliser le code de validation suivant :
          </p>

          <div style="text-align:center; margin:30px 0;">
            <span style="
              display:inline-block;
              background-color:#c09544;
              color:#ffffff;
              padding:15px 30px;
              font-size:28px;
              letter-spacing:6px;
              border-radius:6px;
              font-weight:bold;
            ">
              ${otp}
            </span>
          </div>

          <p>
            Ce code est valide pour une durée limitée de 10 minutes.
          </p>

          <p>
            Si vous n'avez pas demandé cette action, veuillez ignorer cet email.
            Pour des raisons de sécurité, ne partagez jamais ce code avec qui que ce soit.
          </p>

          <p>
            En cas de besoin, contactez-nous à 
            <a href="mailto:support@waariko.com" style="color:#c09544; text-decoration:none;">
              support@waariko.com
            </a>
          </p>

          <p>Merci d'utiliser Waariko.</p>

          <p>Cordialement,<br/>L'équipe Waariko</p>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f4f4f4; padding:20px; text-align:center; font-size:12px; color:#777;">
          © ${new Date().getFullYear()} Waariko. Tous droits réservés.
        </td>
      </tr>

    </table>

  </body>
  </html>
  `;
};
