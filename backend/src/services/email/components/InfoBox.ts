/**
 * InfoBox Component - Gmail Compatible
 * Caja de información con decoración geométrica usando tablas
 */

interface InfoBoxProps {
  label: string;
  value: string;
}

export function InfoBox({ label, value }: InfoBoxProps): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
      <tr>
        <td style="
          background-color: #1a1a1a;
          border: 2px solid #FFFFFF;
          border-left: 4px solid #FFFFFF;
          padding: 20px;
        ">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="
                color: #FFFFFF;
                font-family: 'Courier New', Courier, monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                padding-bottom: 10px;
                opacity: 0.7;
              ">
                ${label}
              </td>
            </tr>
            <tr>
              <td style="
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 15px;
                line-height: 1.6;
                word-wrap: break-word;
              ">
                ${value}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
