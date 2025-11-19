/**
 * Newsletter Notification Email Template - SergioJA Brand
 * Email de notificación de nuevo suscriptor con diseño monocromático
 */

import { emailLayout } from './emailLayout';
import { Divider, InfoBox, Icon, Text, Header } from '../components';

interface NewsletterNotificationData {
  email: string;
}

export function newsletterNotificationTemplate(data: NewsletterNotificationData): {
  html: string;
  text: string;
} {
  const content = `
    ${Icon({ type: 'info', size: 80 })}

    ${Header({
      title: 'NUEVO SUSCRIPTOR',
      subtitle: new Date().toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    })}

    ${Divider()}

    ${InfoBox({ 
      label: 'Email', 
      value: data.email 
    })}

    ${Divider()}

    ${Text({
      content: 'Se ha registrado un nuevo suscriptor en el newsletter DevTips desde el sitio web.',
      align: 'center',
      size: 'base',
    })}
    
    <div style="
      margin: 30px 0;
      padding: 20px;
      background: #1a1a1a;
      border: 2px solid #FFFFFF;
      border-left: 4px solid #FFFFFF;
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -2px;
        right: -2px;
        width: 12px;
        height: 12px;
        background: #000000;
        border: 2px solid #FFFFFF;
        border-left: none;
        border-bottom: none;
      "></div>
      
      ${Text({
        content: '<strong>ACCIÓN SUGERIDA</strong>',
        size: 'sm',
        bold: true,
        mono: true,
      })}
      
      ${Text({
        content: 'Considera agregar este contacto a tu lista de correo para futuras comunicaciones.',
        size: 'sm',
      })}
    </div>
  `;

  const html = emailLayout({
    title: 'NUEVO SUSCRIPTOR',
    content,
    showFooter: false,
  });

  const text = `
NUEVO SUSCRIPTOR - NEWSLETTER
==============================

Email: ${data.email}
Fecha: ${new Date().toLocaleString('es-ES')}

Se ha registrado un nuevo suscriptor en el newsletter DevTips.
  `.trim();

  return { html, text };
}
