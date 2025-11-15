import { emailLayout } from './emailLayout';
import { Divider, Icon, Text } from '../components/emailComponents';

interface NewsletterWelcomeData {
  email: string;
}

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): {
  html: string;
  text: string;
} {
  const content = `
    ${Icon({ type: 'success', size: 64 })}

    <h2 style="
      color: #00BFFF;
      font-size: 22px;
      font-weight: 700;
      text-align: center;
      margin: 20px 0;
    ">
      ¡Bienvenido al Newsletter!
    </h2>

    ${Divider('#00BFFF')}

    ${Text({
      content: 'Gracias por suscribirte. Te enviaré tips de desarrollo, ideas y recursos útiles. Puedes darte de baja en cualquier momento.',
      align: 'center',
      color: '#a0a0b0',
      size: 'base',
    })}
  `;

  const html = emailLayout({
    title: '✅ Suscripción confirmada',
    content,
    accentColor: '#00BFFF',
    showFooter: true,
  });

  const text = `Bienvenido al newsletter. Gracias por suscribirte.`;

  return { html, text };
}
