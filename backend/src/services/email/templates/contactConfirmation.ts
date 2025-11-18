/**
 * Contact Confirmation Email Template - SergioJA Brand
 * Email de confirmación monocromático con diseño hexagonal
 */

import { emailLayout } from './emailLayout';
import { Text, Divider, Icon, Header, Footer } from '../components/emailComponents';

interface ContactConfirmationData {
  name: string;
  email: string;
}

export function contactConfirmationTemplate(data: ContactConfirmationData): {
  html: string;
  text: string;
} {
  const content = `
    ${Icon({ type: 'success', size: 80 })}
    
    ${Header({
      title: 'MENSAJE RECIBIDO',
      subtitle: 'Confirmación de contacto'
    })}
    
    ${Divider()}
    
    ${Text({
      content: `Hola <strong>${data.name}</strong>,`,
      size: 'lg',
      bold: false,
    })}
    
    ${Text({
      content: 'Gracias por ponerte en contacto. He recibido tu mensaje y lo revisaré lo antes posible.',
      size: 'base',
    })}
    
    ${Text({
      content: 'Normalmente respondo en un plazo de <strong>24-48 horas</strong>. Si tu consulta es urgente, contáctame directamente por email.',
      size: 'base',
    })}
    
    ${Divider()}
    
    <div style="
      background: #1a1a1a;
      border: 2px solid #FFFFFF;
      border-left: 4px solid #FFFFFF;
      padding: 24px;
      margin: 30px 0;
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
        content: '<strong>MIENTRAS TANTO...</strong>',
        size: 'base',
        bold: true,
        mono: true,
      })}
      
      ${Text({
        content: 'Explora mis proyectos más recientes en mi portfolio.',
        size: 'sm',
      })}
      
      <a href="https://portfolio.sergioja.com" style="
        display: inline-block;
        margin-top: 16px;
        padding: 12px 28px;
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
        VER PORTFOLIO
      </a>
    </div>
    
    ${Divider()}
    
    ${Text({
      content: 'Saludos,',
      size: 'base',
      align: 'left',
    })}
    
    <div style="margin: 24px 0;">
      <p style="
        color: #FFFFFF;
        font-size: 20px;
        font-weight: 700;
        margin: 0;
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
      ">
        SERGIO JÁUREGUI
      </p>
      <p style="
        color: #FFFFFF;
        font-size: 13px;
        margin: 8px 0 0 0;
        opacity: 0.6;
        letter-spacing: 0.5px;
      ">
        Full Stack Developer
      </p>
    </div>
    
    <p style="
      color: #FFFFFF;
      font-size: 11px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
      opacity: 0.5;
      font-family: 'Courier New', monospace;
    ">
      EMAIL AUTOMÁTICO · NO RESPONDER
    </p>
  `;

  const html = emailLayout({
    title: 'CONFIRMACIÓN',
    content,
    showFooter: false,
  });

  const text = `
MENSAJE RECIBIDO
==================

Hola ${data.name},

Gracias por ponerte en contacto. He recibido tu mensaje y lo revisaré lo antes posible.

Normalmente respondo en un plazo de 24-48 horas. Si tu consulta es urgente, contáctame directamente por email.

MIENTRAS TANTO...
Explora mis proyectos más recientes en: https://portfolio.sergioja.com

Saludos,

SERGIO JÁUREGUI
Full Stack Developer

---
EMAIL AUTOMÁTICO · NO RESPONDER
  `.trim();

  return { html, text };
}
