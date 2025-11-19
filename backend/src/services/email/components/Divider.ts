/**
 * Divider Component - Gmail Compatible
 * Separador con hexágono central usando tablas
 */

export function Divider(): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
      <tr>
        <td style="
          height: 1px;
          background-color: rgba(255, 255, 255, 0.3);
          line-height: 1px;
          font-size: 1px;
        ">
          &nbsp;
        </td>
      </tr>
    </table>
  `;
}
