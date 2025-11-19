/**
 * Text Component - Gmail Compatible
 * Componente de texto usando tablas para mejor compatibilidad
 */

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

  const fontFamily = mono 
    ? "'Courier New', Courier, monospace" 
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 14px 0;">
      <tr>
        <td align="${align}" style="
          color: #FFFFFF;
          font-family: ${fontFamily};
          font-size: ${sizes[size]};
          line-height: 1.7;
          font-weight: ${bold ? '700' : '400'};
          opacity: ${bold ? '1' : '0.9'};
        ">
          ${content}
        </td>
      </tr>
    </table>
  `;
}
