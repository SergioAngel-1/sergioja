/**
 * Newsletter Welcome Email Template - SergioJA Brand
 * Email de bienvenida monocromático con diseño hexagonal
 */

import { emailLayout } from './emailLayout';
import { Divider, Icon, Text, Header } from '../components/emailComponents';

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
    
    <div style="
      text-align: center;
      margin: 30px 0;
    ">
      <a href="https://sergioja.com" style="
        display: inline-block;
        padding: 14px 32px;
        background: #FFFFFF;
        color: #000000;
        text-decoration: none;
        font-weight: 700;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-family: 'Courier New', monospace;
        border: 2px solid #FFFFFF;
        clip-path: polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%);
      ">
        VISITAR WEB
      </a>
    </div>
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
