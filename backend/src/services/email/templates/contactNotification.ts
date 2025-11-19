/**
 * Contact Notification Email Template - SergioJA Brand
 * Email de notificación monocromático con diseño hexagonal
 */

import { emailLayout } from './emailLayout';
import { InfoBox, MessageBox, Divider, Icon, Header } from '../components';

interface ContactNotificationData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function contactNotificationTemplate(data: ContactNotificationData): {
  html: string;
  text: string;
} {
  const content = `
    ${Icon({ type: 'info', size: 80 })}
    
    ${Header({
      title: 'NUEVO CONTACTO',
      subtitle: new Date().toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    })}
    
    ${Divider()}
    
    ${InfoBox({
      label: 'Remitente',
      value: data.name,
    })}
    
    ${InfoBox({
      label: 'Email',
      value: data.email,
    })}
    
    ${InfoBox({
      label: 'Asunto',
      value: data.subject,
    })}
    
    ${Divider()}
    
    <div style="
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 24px 0 12px 0;
      font-family: 'Courier New', monospace;
      opacity: 0.7;
    ">
      Mensaje
    </div>
    
    ${MessageBox({
      message: data.message,
    })}
    
    <p style="
      color: #FFFFFF;
      font-size: 13px;
      text-align: center;
      margin-top: 30px;
      padding: 16px;
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-family: 'Courier New', monospace;
      opacity: 0.8;
    ">
      → Responde a <strong>${data.email}</strong>
    </p>
  `;

  const html = emailLayout({
    title: 'NUEVO CONTACTO',
    content,
    showFooter: false,
  });

  const text = `
NUEVO MENSAJE DE CONTACTO
========================

Remitente: ${data.name}
Email: ${data.email}
Asunto: ${data.subject}

Mensaje:
--------
${data.message}

---
Recibido: ${new Date().toLocaleString('es-ES')}
Responde directamente a ${data.email}
  `.trim();

  return { html, text };
}
