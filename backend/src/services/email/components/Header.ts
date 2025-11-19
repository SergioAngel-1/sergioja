/**
 * Header Component - Gmail Compatible
 * Encabezado con decoración hexagonal usando tablas
 */

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0 30px;">
      <tr>
        <td align="center">
          <!-- Hexagonal decoration -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 20px;">
            <tr>
              <td>
                <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#FFFFFF" stroke-width="4" fill="#000000"/>
                  <circle cx="50" cy="50" r="8" fill="#FFFFFF"/>
                </svg>
              </td>
            </tr>
          </table>
          
          <!-- Title -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td align="center" style="
                color: #FFFFFF;
                font-family: 'Courier New', Courier, monospace;
                font-size: 28px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                padding-bottom: ${subtitle ? '10px' : '0'};
              ">
                ${title}
              </td>
            </tr>
            ${subtitle ? `
            <tr>
              <td align="center" style="
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                opacity: 0.6;
                letter-spacing: 0.5px;
              ">
                ${subtitle}
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>
  `;
}
