import { navEn } from './nav';
import { commonEn } from './common';
import { homeEn } from './home';
import { workEn } from './work';
import { projectsEn } from './projects';
import { aboutEn } from './about';
import { contactEn } from './contact';
import { faqEn } from './faq';
import { termsEn } from './terms';
import { otherEn } from './other';
import { terminalEn } from './terminal';
import { gamesEn } from './games';

export const en = {
  ...navEn,
  ...commonEn,
  ...homeEn,
  ...workEn,
  ...projectsEn,
  ...aboutEn,
  ...contactEn,
  ...faqEn,
  ...termsEn,
  ...otherEn,
  ...terminalEn,
  ...gamesEn,
} as const;
