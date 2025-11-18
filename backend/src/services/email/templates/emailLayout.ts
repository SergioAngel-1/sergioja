/**
 * Email Layout Component - SergioJA Brand
 * Layout monocromático con diseño hexagonal y cyberpunk
 */

interface EmailLayoutProps {
  title: string;
  content: string;
  showFooter?: boolean;
}

export function emailLayout({
  title,
  content,
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
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #000000;
        color: #FFFFFF;
        line-height: 1.6;
        padding: 20px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .email-wrapper {
        max-width: 600px;
        margin: 0 auto;
        background: #000000;
        border: 3px solid #FFFFFF;
        position: relative;
      }
      
      /* Hexagonal corner decorations */
      .corner-hex {
        position: absolute;
        width: 16px;
        height: 16px;
        background: #000000;
        border: 2px solid #FFFFFF;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      }
      
      .corner-hex.top-left {
        top: -8px;
        left: 20px;
      }
      
      .corner-hex.top-right {
        top: -8px;
        right: 20px;
      }
      
      .corner-hex.bottom-left {
        bottom: -8px;
        left: 20px;
      }
      
      .corner-hex.bottom-right {
        bottom: -8px;
        right: 20px;
      }
      
      .email-header {
        background: #000000;
        border-bottom: 2px solid #FFFFFF;
        padding: 40px 30px;
        text-align: center;
        position: relative;
      }
      
      .email-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #FFFFFF, transparent);
        opacity: 0.3;
      }
      
      .email-header h1 {
        color: #FFFFFF;
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-family: 'Courier New', monospace;
      }
      
      .email-body {
        padding: 40px 30px;
        background: #000000;
      }
      
      .email-footer {
        background: #000000;
        border-top: 2px solid #FFFFFF;
        padding: 30px;
        text-align: center;
        position: relative;
      }
      
      .email-footer::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, #FFFFFF, transparent);
        opacity: 0.2;
      }
      
      .email-footer p {
        color: #FFFFFF;
        font-size: 12px;
        margin: 8px 0;
        opacity: 0.5;
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
      }
      
      .email-footer a {
        color: #FFFFFF;
        text-decoration: none;
        opacity: 0.7;
      }
      
      .email-footer a:hover {
        opacity: 1;
      }
      
      /* Responsive */
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px;
        }
        
        .email-header,
        .email-body,
        .email-footer {
          padding: 25px 20px;
        }
        
        .email-header h1 {
          font-size: 22px;
          letter-spacing: 1.5px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <!-- Hexagonal corner decorations -->
      <div class="corner-hex top-left"></div>
      <div class="corner-hex top-right"></div>
      <div class="corner-hex bottom-left"></div>
      <div class="corner-hex bottom-right"></div>
      
      <div class="email-header">
        <h1>${title}</h1>
      </div>
      
      <div class="email-body">
        ${content}
      </div>
      
      ${showFooter ? `
      <div class="email-footer">
        <p>SERGIOJA © ${new Date().getFullYear()}</p>
        <p><a href="https://sergioja.com">sergioja.com</a></p>
      </div>
      ` : ''}
    </div>
  </body>
</html>
  `.trim();
}
