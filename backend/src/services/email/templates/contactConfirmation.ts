/**
 * Contact Confirmation Email Template
 * Email de confirmación enviado al usuario que envió el mensaje
 */

import { emailLayout } from './emailLayout';
import { Text, Divider, Icon, SocialLinks } from '../components/emailComponents';

interface ContactConfirmationData {
  name: string;
  email: string;
}

export function contactConfirmationTemplate(data: ContactConfirmationData): {
  html: string;
  text: string;
} {
  const content = `
    ${Icon({ type: 'success', size: 72 })}
    
    <h2 style="
      color: #8B00FF;
      font-size: 26px;
      font-weight: 700;
      text-align: center;
      margin: 20px 0;
      letter-spacing: -0.5px;
    ">
      ¡Mensaje recibido!
    </h2>
    
    ${Divider('#8B00FF')}
    
    ${Text({
      content: `Hola <strong style="color: #8B00FF;">${data.name}</strong>,`,
      size: 'lg',
      bold: false,
    })}
    
    ${Text({
      content: 'Gracias por ponerte en contacto conmigo. He recibido tu mensaje y lo revisaré lo antes posible.',
      size: 'base',
    })}
    
    ${Text({
      content: 'Normalmente respondo en un plazo de <strong>24-48 horas</strong>. Si tu consulta es urgente, no dudes en contactarme directamente por email.',
      size: 'base',
    })}
    
    ${Divider('#8B00FF')}
    
    <div style="
      background: linear-gradient(135deg, #8B00FF15 0%, #00BFFF15 100%);
      border: 1px solid #8B00FF40;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    ">
      ${Text({
        content: '💡 <strong>Mientras tanto...</strong>',
        size: 'base',
        color: '#8B00FF',
        bold: true,
      })}
      
      ${Text({
        content: 'Te invito a explorar mis proyectos más recientes y conectar conmigo en redes sociales.',
        size: 'sm',
        color: '#a0a0b0',
      })}
    </div>
    
    ${SocialLinks({
      github: 'https://github.com/sergiojaregui',
      linkedin: 'https://linkedin.com/in/sergiojaregui',
      website: 'https://sergioja.com',
    })}
    
    ${Divider('#8B00FF')}
    
    ${Text({
      content: 'Saludos cordiales,',
      size: 'base',
      align: 'left',
    })}
    
    <div style="margin: 20px 0;">
      <p style="
        color: #8B00FF;
        font-size: 20px;
        font-weight: 700;
        margin: 0;
      ">
        Sergio Jáuregui
      </p>
      <p style="
        color: #a0a0b0;
        font-size: 14px;
        margin: 5px 0 0 0;
      ">
        Full Stack Developer
      </p>
    </div>
    
    <p style="
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ffffff20;
      text-align: center;
    ">
      Este es un email automático de confirmación. Por favor no respondas a este mensaje.
    </p>
  `;

  const html = emailLayout({
    title: '✓ Confirmación de Contacto',
    content,
    accentColor: '#8B00FF',
    showFooter: true,
  });

  const text = `
¡MENSAJE RECIBIDO!
==================

Hola ${data.name},

Gracias por ponerte en contacto conmigo. He recibido tu mensaje y lo revisaré lo antes posible.

Normalmente respondo en un plazo de 24-48 horas. Si tu consulta es urgente, no dudes en contactarme directamente por email.

MIENTRAS TANTO...
Te invito a explorar mis proyectos más recientes y conectar conmigo en redes sociales:

- GitHub: https://github.com/sergiojaregui
- LinkedIn: https://linkedin.com/in/sergiojaregui
- Website: https://sergioja.com

Saludos cordiales,

Sergio Jáuregui
Full Stack Developer

---
Este es un email automático de confirmación.
  `.trim();

  return { html, text };
}
