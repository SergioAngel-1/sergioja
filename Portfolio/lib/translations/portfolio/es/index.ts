import { navEs } from './nav';
import { commonEs } from './common';
import { homeEs } from './home';
import { workEs } from './work';
import { projectsEs } from './projects';
import { aboutEs } from './about';
import { contactEs } from './contact';
import { faqEs } from './faq';
import { termsEs } from './terms';
import { otherEs } from './other';
import { terminalEs } from './terminal';
import { gamesEs } from './games';

export const es = {
  ...navEs,
  ...commonEs,
  ...homeEs,
  ...workEs,
  ...projectsEs,
  ...aboutEs,
  ...contactEs,
  ...faqEs,
  ...termsEs,
  ...otherEs,
  ...terminalEs,
  ...gamesEs,
} as const;
