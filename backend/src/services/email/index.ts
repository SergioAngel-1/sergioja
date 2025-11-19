/**
 * Email Service Module
 * Sistema modular de emails con plantillas y componentes reutilizables
 */

// Templates
export { contactNotificationTemplate } from './templates/contactNotification';
export { contactConfirmationTemplate } from './templates/contactConfirmation';
export { newsletterWelcomeTemplate } from './templates/newsletterWelcome';
export { newsletterNotificationTemplate } from './templates/newsletterNotification';
export { emailLayout } from './templates/emailLayout';

// Components (Gmail Compatible)
export {
  Button,
  InfoBox,
  MessageBox,
  Icon,
  SocialLinks,
  Divider,
  Text,
  Header,
  Footer,
} from './components';
