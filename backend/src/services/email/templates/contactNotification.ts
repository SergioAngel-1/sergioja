/**
 * Contact Notification Email Template
 * Email enviado al propietario cuando recibe un mensaje de contacto
 */

import { emailLayout } from './emailLayout';
import { InfoBox, MessageBox, Divider, Icon } from '../components/emailComponents';

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
    ${Icon({ type: 'info', size: 64 })}
    
    <h2 style="
      color: #00BFFF;
      font-size: 22px;
      font-weight: 700;
      text-align: center;
      margin: 20px 0;
    ">
      Nuevo mensaje de contacto
    </h2>
    
    <p style="
      color: #a0a0b0;
      font-size: 14px;
      text-align: center;
      margin-bottom: 30px;
    ">
      Recibido el ${new Date().toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short',
      })}
    </p>
    
    ${Divider('#00BFFF')}
    
    ${InfoBox({
      label: 'Remitente',
      value: data.name,
      color: '#00BFFF',
    })}
    
    ${InfoBox({
      label: 'Email',
      value: data.email,
      color: '#00BFFF',
    })}
    
    ${InfoBox({
      label: 'Asunto',
      value: data.subject,
      color: '#00BFFF',
    })}
    
    ${Divider('#00BFFF')}
    
    <div style="
      color: #8B00FF;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin: 20px 0 10px 0;
    ">
      Mensaje
    </div>
    
    ${MessageBox({
      message: data.message,
      color: '#00BFFF',
    })}
    
    <p style="
      color: #a0a0b0;
      font-size: 13px;
      text-align: center;
      margin-top: 30px;
      font-style: italic;
    ">
      💡 Responde directamente a <strong style="color: #00BFFF;">${data.email}</strong> para contactar al remitente
    </p>
  `;

  const html = emailLayout({
    title: '🚀 Nuevo Mensaje de Contacto',
    content,
    accentColor: '#00BFFF',
    showFooter: true,
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
