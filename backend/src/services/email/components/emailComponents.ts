/**
 * Email Components - SergioJA Brand
 * Componentes de email con diseño monocromático, hexagonal y cyberpunk
 * Paleta: Negro (#000000), Blanco (#FFFFFF), Grises (#1a1a1a, #2a2a2a)
 */

interface ButtonProps {
  text: string;
  url: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ text, url, variant = 'primary' }: ButtonProps): string {
  const isPrimary = variant === 'primary';
  
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 24px auto;">
      <tr>
        <td style="
          background: ${isPrimary ? '#FFFFFF' : 'transparent'};
          border: 2px solid #FFFFFF;
          clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%);
          padding: 2px;
        ">
          <a href="${url}" target="_blank" style="
            display: inline-block;
            padding: 14px 40px;
            font-size: 14px;
            font-weight: 700;
            color: ${isPrimary ? '#000000' : '#FFFFFF'};
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-family: 'Courier New', monospace;
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
}

export function InfoBox({ label, value }: InfoBoxProps): string {
  return `
    <div style="
      margin: 20px 0;
      padding: 20px;
      background: #1a1a1a;
      border: 2px solid #FFFFFF;
      border-left: 4px solid #FFFFFF;
      position: relative;
    ">
      <!-- Decorative corner -->
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
      
      <div style="
        color: #FFFFFF;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 10px;
        font-family: 'Courier New', monospace;
        opacity: 0.7;
      ">
        ${label}
      </div>
      <div style="
        color: #FFFFFF;
        font-size: 15px;
        line-height: 1.6;
        word-wrap: break-word;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        ${value}
      </div>
    </div>
  `;
}

interface MessageBoxProps {
  message: string;
}

export function MessageBox({ message }: MessageBoxProps): string {
  return `
    <div style="
      margin: 24px 0;
      padding: 24px;
      background: #000000;
      border: 2px solid #FFFFFF;
      position: relative;
    ">
      <!-- Hexagonal decorative dots -->
      <div style="
        position: absolute;
        top: -6px;
        left: 20px;
        width: 8px;
        height: 8px;
        background: #FFFFFF;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      "></div>
      <div style="
        position: absolute;
        bottom: -6px;
        right: 20px;
        width: 8px;
        height: 8px;
        background: #FFFFFF;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      "></div>
      
      <div style="
        color: #FFFFFF;
        font-size: 15px;
        line-height: 1.8;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: system-ui, -apple-system, sans-serif;
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

export function Icon({ type, size = 64 }: IconProps): string {
  const icons = {
    success: `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Hexagon -->
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="3" fill="#000000"/>
        <!-- Check mark -->
        <path d="M35 50 L45 60 L65 40" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    info: `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Hexagon -->
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="3" fill="#000000"/>
        <!-- Info icon -->
        <circle cx="50" cy="35" r="3" fill="#FFFFFF"/>
        <line x1="50" y1="45" x2="50" y2="70" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `,
    warning: `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Hexagon -->
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="3" fill="#000000"/>
        <!-- Warning icon -->
        <line x1="50" y1="30" x2="50" y2="55" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="65" r="3" fill="#FFFFFF"/>
      </svg>
    `,
    error: `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Hexagon -->
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="3" fill="#000000"/>
        <!-- X mark -->
        <line x1="35" y1="35" x2="65" y2="65" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        <line x1="65" y1="35" x2="35" y2="65" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `,
  };

  return `
    <div style="text-align: center; margin: 30px 0;">
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

export function Divider(): string {
  return `
    <div style="margin: 32px 0; position: relative;">
      <!-- Main line -->
      <div style="
        height: 1px;
        background: linear-gradient(90deg, transparent, #FFFFFF, transparent);
        opacity: 0.3;
      "></div>
      <!-- Center hexagon -->
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: #000000;
        border: 2px solid #FFFFFF;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      "></div>
    </div>
  `;
}

interface TextProps {
  content: string;
  size?: 'sm' | 'base' | 'lg';
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  mono?: boolean;
}

export function Text({ 
  content, 
  size = 'base', 
  align = 'left',
  bold = false,
  mono = false
}: TextProps): string {
  const sizes = {
    sm: '13px',
    base: '15px',
    lg: '18px',
  };

  return `
    <p style="
      color: #FFFFFF;
      font-size: ${sizes[size]};
      line-height: 1.7;
      margin: 14px 0;
      text-align: ${align};
      font-weight: ${bold ? '700' : '400'};
      font-family: ${mono ? "'Courier New', monospace" : 'system-ui, -apple-system, sans-serif'};
      opacity: ${bold ? '1' : '0.9'};
    ">
      ${content}
    </p>
  `;
}

// Nuevo componente: Header con diseño hexagonal
interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps): string {
  return `
    <div style="text-align: center; margin: 40px 0 30px;">
      <!-- Hexagonal decoration top -->
      <div style="margin: 0 auto 20px; width: 40px; height: 40px;">
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="4" fill="#000000"/>
          <circle cx="50" cy="50" r="8" fill="#FFFFFF"/>
        </svg>
      </div>
      
      <h1 style="
        color: #FFFFFF;
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 10px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-family: 'Courier New', monospace;
      ">
        ${title}
      </h1>
      
      ${subtitle ? `
        <p style="
          color: #FFFFFF;
          font-size: 14px;
          margin: 0;
          opacity: 0.6;
          letter-spacing: 0.5px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          ${subtitle}
        </p>
      ` : ''}
    </div>
  `;
}

// Nuevo componente: Footer minimalista
export function Footer(): string {
  return `
    <div style="
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
    ">
      <p style="
        color: #FFFFFF;
        font-size: 12px;
        margin: 8px 0;
        opacity: 0.5;
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
      ">
        SERGIOJA © ${new Date().getFullYear()}
      </p>
      <p style="
        color: #FFFFFF;
        font-size: 11px;
        margin: 8px 0;
        opacity: 0.4;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <a href="https://sergioja.com" style="color: #FFFFFF; text-decoration: none;">sergioja.com</a>
      </p>
    </div>
  `;
}
