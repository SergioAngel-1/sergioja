/**
 * Button Component - Gmail Compatible
 * Botón hexagonal usando tablas para compatibilidad con Gmail
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
        <td align="center" style="
          background-color: ${isPrimary ? '#FFFFFF' : '#000000'};
          border: 2px solid #FFFFFF;
        ">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="
                padding: 14px 40px;
                font-family: 'Courier New', Courier, monospace;
                font-size: 14px;
                font-weight: 700;
                color: ${isPrimary ? '#000000' : '#FFFFFF'};
                text-transform: uppercase;
                letter-spacing: 1.5px;
                line-height: 1;
              ">
                <a href="${url}" target="_blank" style="
                  color: ${isPrimary ? '#000000' : '#FFFFFF'};
                  text-decoration: none;
                  display: block;
                ">
                  ${text}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
