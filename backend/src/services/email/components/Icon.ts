/**
 * Icon Component - Gmail Compatible
 * Iconos hexagonales SVG usando tablas para centrado
 */

interface IconProps {
  type: 'success' | 'info' | 'warning' | 'error';
  size?: number;
}

export function Icon({ type, size = 64 }: IconProps): string {
  const icons = {
    success: `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="3" fill="#000000"/>
        <path d="M35 50 L45 60 L65 40" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    info: `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="3" fill="#000000"/>
        <circle cx="50" cy="35" r="3" fill="#FFFFFF"/>
        <line x1="50" y1="45" x2="50" y2="70" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `,
    warning: `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="3" fill="#000000"/>
        <line x1="50" y1="30" x2="50" y2="55" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="65" r="3" fill="#FFFFFF"/>
      </svg>
    `,
    error: `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="3" fill="#000000"/>
        <line x1="35" y1="35" x2="65" y2="65" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        <line x1="65" y1="35" x2="35" y2="65" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `,
  };

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
      <tr>
        <td align="center">
          ${icons[type]}
        </td>
      </tr>
    </table>
  `;
}
