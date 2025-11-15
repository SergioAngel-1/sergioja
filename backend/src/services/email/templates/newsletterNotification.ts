import { emailLayout } from './emailLayout';
import { Divider, InfoBox, Icon, Text } from '../components/emailComponents';

interface NewsletterNotificationData {
  email: string;
}

export function newsletterNotificationTemplate(data: NewsletterNotificationData): {
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
      Nuevo suscriptor del Newsletter
    </h2>

    ${Divider('#00BFFF')}

    ${InfoBox({ label: 'Email', value: data.email, color: '#00BFFF' })}

    ${Text({
      content: 'Se ha registrado un nuevo suscriptor en el newsletter desde el sitio web.',
      align: 'center',
      color: '#a0a0b0',
      size: 'base',
    })}
  `;

  const html = emailLayout({
    title: '📰 Nuevo Suscriptor - Newsletter',
    content,
    accentColor: '#00BFFF',
    showFooter: true,
  });

  const text = `Nuevo suscriptor del Newsletter\nEmail: ${data.email}`.trim();

  return { html, text };
}
