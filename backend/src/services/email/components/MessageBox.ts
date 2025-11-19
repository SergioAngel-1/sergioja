/**
 * MessageBox Component - Gmail Compatible
 * Caja de mensaje con decoraciones hexagonales usando tablas
 */

interface MessageBoxProps {
  message: string;
}

export function MessageBox({ message }: MessageBoxProps): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="
          background-color: #000000;
          border: 2px solid #FFFFFF;
          padding: 24px;
        ">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 15px;
                line-height: 1.8;
                white-space: pre-wrap;
                word-wrap: break-word;
              ">
                ${message}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
