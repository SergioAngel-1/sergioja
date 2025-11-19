/**
 * Newsletter Welcome Email Template - SergioJA Brand
 * Email de bienvenida monocromático con diseño hexagonal
 */

import { emailLayout } from './emailLayout';
import { Divider, Icon, Text, Header } from '../components';

interface NewsletterWelcomeData {
  email: string;
}

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): {
  html: string;
  text: string;
} {
  const content = `
    ${Icon({ type: 'success', size: 80 })}

    ${Header({
      title: 'BIENVENIDO',
      subtitle: 'Newsletter DevTips'
    })}

    ${Divider()}

    ${Text({
      content: 'Gracias por suscribirte. Recibirás tips de desarrollo, ideas y recursos útiles directamente en tu inbox.',
      align: 'center',
      size: 'base',
    })}
    
    ${Text({
      content: 'Puedes darte de baja en cualquier momento.',
      align: 'center',
      size: 'sm',
    })}
    
    ${Divider()}
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="background-color: #FFFFFF; border: 2px solid #FFFFFF;">
                <a href="https://sergioja.com" style="
                  display: block;
                  padding: 14px 32px;
                  color: #000000;
                  text-decoration: none;
                  font-weight: 700;
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 1.5px;
                  font-family: 'Courier New', Courier, monospace;
                ">
                  VISITAR WEB
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const html = emailLayout({
    title: 'SUSCRIPCIÓN',
    content,
    showFooter: false,
  });

  const text = `
BIENVENIDO AL NEWSLETTER
========================

Gracias por suscribirte. Recibirás tips de desarrollo, ideas y recursos útiles.

Visita: https://sergioja.com
  `.trim();

  return { html, text };
}
