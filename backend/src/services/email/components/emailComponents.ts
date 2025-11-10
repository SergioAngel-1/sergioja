/**
 * Email Components
 * Componentes reutilizables para construir emails
 */

interface ButtonProps {
  text: string;
  url: string;
  color?: string;
}

export function Button({ text, url, color = '#00BFFF' }: ButtonProps): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
      <tr>
        <td style="border-radius: 6px; background: ${color};">
          <a href="${url}" target="_blank" style="
            display: inline-block;
            padding: 14px 32px;
            font-size: 16px;
            font-weight: 600;
            color: #000000;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.3s ease;
          ">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

interface InfoBoxProps {
  label: string;
  value: string;
  color?: string;
}

export function InfoBox({ label, value, color = '#00BFFF' }: InfoBoxProps): string {
  return `
    <div style="
      margin: 15px 0;
      padding: 15px;
      background: #252540;
      border-left: 4px solid ${color};
      border-radius: 6px;
    ">
      <div style="
        color: #8B00FF;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        margin-bottom: 8px;
      ">
        ${label}
      </div>
      <div style="
        color: #e0e0e0;
        font-size: 15px;
        line-height: 1.5;
        word-wrap: break-word;
      ">
        ${value}
      </div>
    </div>
  `;
}

interface MessageBoxProps {
  message: string;
  color?: string;
}

export function MessageBox({ message, color = '#00BFFF' }: MessageBoxProps): string {
  return `
    <div style="
      margin: 20px 0;
      padding: 20px;
      background: #252540;
      border: 1px solid ${color}40;
      border-radius: 8px;
    ">
      <div style="
        color: #e0e0e0;
        font-size: 15px;
        line-height: 1.8;
        white-space: pre-wrap;
        word-wrap: break-word;
      ">
        ${message}
      </div>
    </div>
  `;
}

interface IconProps {
  type: 'success' | 'info' | 'warning' | 'error';
  size?: number;
}

export function Icon({ type, size = 48 }: IconProps): string {
  const icons = {
    success: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#10B981" opacity="0.2"/>
        <path d="M9 12l2 2 4-4" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="10" stroke="#10B981" stroke-width="2"/>
      </svg>
    `,
    info: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#00BFFF" opacity="0.2"/>
        <path d="M12 16v-4M12 8h.01" stroke="#00BFFF" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="10" stroke="#00BFFF" stroke-width="2"/>
      </svg>
    `,
    warning: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 20h20L12 2z" fill="#F59E0B" opacity="0.2"/>
        <path d="M12 9v4M12 17h.01" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 2L2 20h20L12 2z" stroke="#F59E0B" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    `,
    error: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#EF4444" opacity="0.2"/>
        <path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="10" stroke="#EF4444" stroke-width="2"/>
      </svg>
    `,
  };

  return `
    <div style="text-align: center; margin: 20px 0;">
      ${icons[type]}
    </div>
  `;
}

interface SocialLinksProps {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export function SocialLinks({ github, linkedin, twitter, website }: SocialLinksProps): string {
  const links = [];
  
  if (github) {
    links.push(`
      <a href="${github}" style="
        display: inline-block;
        margin: 0 8px;
        padding: 10px;
        background: #ffffff15;
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.3s ease;
      ">
        <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" width="24" height="24" />
      </a>
    `);
  }
  
  if (linkedin) {
    links.push(`
      <a href="${linkedin}" style="
        display: inline-block;
        margin: 0 8px;
        padding: 10px;
        background: #ffffff15;
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.3s ease;
      ">
        <img src="https://cdn.simpleicons.org/linkedin/ffffff" alt="LinkedIn" width="24" height="24" />
      </a>
    `);
  }
  
  if (twitter) {
    links.push(`
      <a href="${twitter}" style="
        display: inline-block;
        margin: 0 8px;
        padding: 10px;
        background: #ffffff15;
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.3s ease;
      ">
        <img src="https://cdn.simpleicons.org/x/ffffff" alt="X/Twitter" width="24" height="24" />
      </a>
    `);
  }
  
  if (website) {
    links.push(`
      <a href="${website}" style="
        display: inline-block;
        margin: 0 8px;
        padding: 10px;
        background: #ffffff15;
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.3s ease;
      ">
        <img src="https://cdn.simpleicons.org/googlechrome/ffffff" alt="Website" width="24" height="24" />
      </a>
    `);
  }

  if (links.length === 0) return '';

  return `
    <div style="text-align: center; margin: 30px 0;">
      <div style="
        color: #a0a0b0;
        font-size: 13px;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
      ">
        Conecta conmigo
      </div>
      <div>
        ${links.join('')}
      </div>
    </div>
  `;
}

export function Divider(color = '#00BFFF'): string {
  return `
    <div style="
      height: 2px;
      background: linear-gradient(90deg, transparent, ${color}40, transparent);
      margin: 25px 0;
    "></div>
  `;
}

interface TextProps {
  content: string;
  size?: 'sm' | 'base' | 'lg';
  color?: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
}

export function Text({ 
  content, 
  size = 'base', 
  color = '#e0e0e0',
  align = 'left',
  bold = false 
}: TextProps): string {
  const sizes = {
    sm: '13px',
    base: '15px',
    lg: '18px',
  };

  return `
    <p style="
      color: ${color};
      font-size: ${sizes[size]};
      line-height: 1.7;
      margin: 12px 0;
      text-align: ${align};
      font-weight: ${bold ? '600' : '400'};
    ">
      ${content}
    </p>
  `;
}
