/**
 * SocialLinks Component - Gmail Compatible
 * Enlaces sociales usando tablas
 */

interface SocialLinksProps {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export function SocialLinks({ github, linkedin, twitter, website }: SocialLinksProps): string {
  const links: string[] = [];

  if (github) {
    links.push(`
      <td style="padding: 0 10px;">
        <a href="${github}" target="_blank" style="
          color: #FFFFFF;
          text-decoration: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
        ">
          GitHub
        </a>
      </td>
    `);
  }

  if (linkedin) {
    links.push(`
      <td style="padding: 0 10px;">
        <a href="${linkedin}" target="_blank" style="
          color: #FFFFFF;
          text-decoration: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
        ">
          LinkedIn
        </a>
      </td>
    `);
  }

  if (twitter) {
    links.push(`
      <td style="padding: 0 10px;">
        <a href="${twitter}" target="_blank" style="
          color: #FFFFFF;
          text-decoration: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
        ">
          Twitter
        </a>
      </td>
    `);
  }

  if (website) {
    links.push(`
      <td style="padding: 0 10px;">
        <a href="${website}" target="_blank" style="
          color: #FFFFFF;
          text-decoration: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
        ">
          Website
        </a>
      </td>
    `);
  }

  if (links.length === 0) {
    return '';
  }

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="
                color: #FFFFFF;
                font-family: 'Courier New', Courier, monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                padding-bottom: 15px;
              ">
                Conecta conmigo
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              ${links.join('')}
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
