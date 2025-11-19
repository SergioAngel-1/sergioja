/**
 * Email Layout Component - SergioJA Brand (Gmail Compatible)
 * Layout monocromático usando tablas para máxima compatibilidad
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${title}</title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        background-color: #000000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      
      a {
        color: #FFFFFF;
        text-decoration: none;
      }
      
      @media only screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
        }
        
        .mobile-padding {
          padding: 20px !important;
        }
        
        .mobile-font-size {
          font-size: 22px !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #000000;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          
          <!-- Main Email Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; background-color: #000000; border: 3px solid #FFFFFF;">
            
            <!-- Header -->
            <tr>
              <td style="background-color: #000000; border-bottom: 2px solid #FFFFFF; padding: 40px 30px;" class="mobile-padding">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="
                      color: #FFFFFF;
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 28px;
                      font-weight: 700;
                      letter-spacing: 2px;
                      text-transform: uppercase;
                      line-height: 1.2;
                    " class="mobile-font-size">
                      ${title}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Body Content -->
            <tr>
              <td style="background-color: #000000; padding: 40px 30px;" class="mobile-padding">
                ${content}
              </td>
            </tr>
            
            <!-- Footer -->
            ${showFooter ? `
            <tr>
              <td style="background-color: #000000; border-top: 2px solid #FFFFFF; padding: 30px;" class="mobile-padding">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="
                      color: #FFFFFF;
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 12px;
                      opacity: 0.5;
                      letter-spacing: 1px;
                      padding-bottom: 8px;
                    ">
                      SERGIOJA © ${new Date().getFullYear()}
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="
                      color: #FFFFFF;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-size: 11px;
                      opacity: 0.4;
                    ">
                      <a href="https://sergioja.com" style="color: #FFFFFF; text-decoration: none;">sergioja.com</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ` : ''}
            
          </table>
          
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}
