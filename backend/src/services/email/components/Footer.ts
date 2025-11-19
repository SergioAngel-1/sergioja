/**
 * Footer Component - Gmail Compatible
 * Pie de página minimalista usando tablas
 */

export function Footer(): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="
                color: #FFFFFF;
                font-family: 'Courier New', Courier, monospace;
                font-size: 12px;
                opacity: 0.5;
                letter-spacing: 1px;
                padding-bottom: 8px;
              ">
                SERGIOJA © ${new Date().getFullYear()}
              </td>
            </tr>
            <tr>
              <td align="center" style="
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 11px;
                opacity: 0.4;
              ">
                <a href="https://sergioja.com" style="color: #FFFFFF; text-decoration: none;">sergioja.com</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
