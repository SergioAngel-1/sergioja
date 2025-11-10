/**
 * Email Layout Component
 * Base layout reutilizable para todos los emails
 */

interface EmailLayoutProps {
  title: string;
  content: string;
  accentColor?: string;
  showFooter?: boolean;
}

export function emailLayout({
  title,
  content,
  accentColor = '#00BFFF',
  showFooter = true,
}: EmailLayoutProps): string {
  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
        color: #e0e0e0;
        line-height: 1.6;
        padding: 20px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .email-wrapper {
        max-width: 600px;
        margin: 0 auto;
        background: #1a1a2e;
        border: 2px solid ${accentColor};
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      }
      
      .email-header {
        background: linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%);
        border-bottom: 2px solid ${accentColor};
        padding: 30px;
        text-align: center;
      }
      
      .email-header h1 {
        color: ${accentColor};
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        letter-spacing: -0.5px;
      }
      
      .email-body {
        padding: 40px 30px;
      }
      
      .email-footer {
        background: #0f0f1a;
        border-top: 1px solid ${accentColor}40;
        padding: 20px 30px;
        text-align: center;
      }
      
      .email-footer p {
        color: #a0a0b0;
        font-size: 12px;
        margin: 5px 0;
      }
      
      .highlight {
        color: ${accentColor};
        font-weight: 600;
      }
      
      .divider {
        height: 2px;
        background: linear-gradient(90deg, transparent, ${accentColor}40, transparent);
        margin: 20px 0;
      }
      
      /* Responsive */
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px;
        }
        
        .email-header,
        .email-body,
        .email-footer {
          padding: 20px;
        }
        
        .email-header h1 {
          font-size: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-header">
        <h1>${title}</h1>
      </div>
      
      <div class="email-body">
        ${content}
      </div>
      
      ${showFooter ? `
      <div class="email-footer">
        <p>Este es un email automático de <strong>Sergio Jáuregui</strong></p>
        <p>© ${new Date().getFullYear()} Sergio Jáuregui. Todos los derechos reservados.</p>
      </div>
      ` : ''}
    </div>
  </body>
</html>
  `.trim();
}
