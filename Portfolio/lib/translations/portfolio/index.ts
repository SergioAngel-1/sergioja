/**
 * Portfolio Translations - Organized by language and type
 * 
 * Structure:
 * - portfolio/
 *   - es/ (Spanish translations)
 *     - nav.ts
 *     - common.ts
 *     - home.ts
 *     - work.ts
 *     - projects.ts
 *     - about.ts
 *     - contact.ts
 *     - other.ts (nextpage, notfound, performance)
 *     - terminal.ts
 *     - games.ts (snake, tetris)
 *     - index.ts (barrel export)
 *   - en/ (English translations)
 *     - [same structure as es/]
 *   - index.ts (main barrel export)
 */

import { Language } from '@/shared/translations';
import { es } from './es';
import { en } from './en';

export interface PortfolioTranslations {
  // Navbar
  'nav.home': string;
  'nav.work': string;
  'nav.about': string;
  'nav.contact': string;
  
  // Common
  'common.previous': string;
  'common.next': string;
  'common.page': string;
  'common.of': string;
  'common.back': string;
  'common.cancel': string;
  'common.close': string;
  
  // Home
  'home.title': string;
  'home.developer': string;
  'home.automation': string;
  'home.engineer': string;
  'home.scalability': string;
  'home.integration': string;
  'home.portfolioLabel': string;
  'home.tagline': string;
  'home.viewProjects': string;
  'home.contact': string;
  'home.available': string;
  'home.name': string;
  'home.firstName': string;
  'home.lastName': string;
  'home.focus': string;
  'home.focusTech': string;
  'home.focusTechSub': string;
  'home.focusTechShort': string;
  'home.focusStrategic': string;
  'home.focusStrategicSub': string;
  'home.focusStrategicShort': string;
  'home.focusHuman': string;
  'home.focusHumanSub': string;
  'home.focusHumanShort': string;
  
  // Work
  'work.title': string;
  'work.description': string;
  'work.fullstack': string;
  'work.uiux': string;
  'work.tech': string;
  'work.total': string;
  'work.featured': string;
  'work.categories': string;
  'work.all': string;
  'work.filter': string;
  'work.fullstackCat': string;
  'work.web': string;
  'work.ai': string;
  'work.mobile': string;
  'work.backend': string;
  'work.frontend': string;
  'work.automation': string;
  'work.devops': string;
  'work.loading': string;
  'work.noProjects': string;
  'work.viewAll': string;
  'work.page': string;
  'work.of': string;
  'work.previous': string;
  'work.next': string;
  
  // Projects
  'projects.viewNow': string;
  'projects.loading': string;
  'projects.backToProjects': string;
  'projects.viewDemo': string;
  'projects.viewPage': string;
  'projects.viewCode': string;
  'projects.privateCode': string;
  'projects.actions': string;
  'projects.preview': string;
  'projects.previewNotAvailable': string;
  'projects.previewDisabledPerformance': string;
  'projects.backToPreview': string;
  'projects.noPreview': string;
  'projects.info': string;
  'projects.status': string;
  'projects.category': string;
  'projects.date': string;
  'projects.completed': string;
  'projects.inProgress': string;
  'projects.planned': string;
  'projects.relatedProjects': string;
  'projects.relatedProjectsDesc': string;
  'projects.viewAllProjects': string;
  'projects.performance': string;
  'projects.accessibility': string;
  'projects.seo': string;
  
  // Next Page Button
  'nextpage.home': string;
  'nextpage.work': string;
  'nextpage.projects': string;
  'nextpage.about': string;
  'nextpage.contact': string;
  'nextpage.next': string;
  
  // About
  'about.title': string;
  'about.intro': string;
  'about.skills': string;
  'about.proficiency': string;
  'about.yearsExp': string;
  'about.categories': string;
  'about.experience': string;
  'about.bio1': string;
  'about.bio1b': string;
  'about.bio1c': string;
  'about.bio2': string;
  'about.bio2b': string;
  'about.bio2c': string;
  'about.bio3': string;
  'about.bio3b': string;
  'about.bio3c': string;
  'about.automation': string;
  'about.automationValue': string;
  'about.architecture': string;
  'about.architectureValue': string;
  'about.integration': string;
  'about.integrationValue': string;
  'about.strategy': string;
  'about.strategyValue': string;
  'about.fullstack': string;
  'about.fullstackValue': string;
  'about.skillsTitle': string;
  'about.all': string;
  'about.filter': string;
  'about.skillsCount': string;
  'about.loading': string;
  'about.noSkills': string;
  'about.education': string;
  'about.certifications': string;
  'about.languages': string;
  'about.interests': string;
  'about.downloadCV': string;
  'about.cvDownloaded': string;
  'about.viewLinkedIn': string;
  'about.viewGitHub': string;
  'about.locationValue': string;
  
  // Contact
  'contact.title': string;
  'contact.intro': string;
  'contact.description': string;
  'contact.lets': string;
  'contact.create': string;
  'contact.something': string;
  'contact.amazing': string;
  'contact.together': string;
  'contact.opportunities': string;
  'contact.sendMessage': string;
  'contact.namePlaceholder': string;
  'contact.emailPlaceholder': string;
  'contact.subjectPlaceholder': string;
  'contact.messagePlaceholder': string;
  'contact.successMsg': string;
  'contact.emailLabel': string;
  'contact.locationLabel': string;
  'contact.locationValue': string;
  'contact.responseTime': string;
  'contact.responseValue': string;
  'contact.connect': string;
  'contact.available': string;
  'contact.availableMsg': string;
  'contact.busy': string;
  'contact.busyMsg': string;
  'contact.unavailable': string;
  'contact.unavailableMsg': string;
  
  // Not Found 404
  'notfound.title': string;
  'notfound.subtitle': string;
  'notfound.message': string;
  'notfound.description': string;
  'notfound.backHome': string;
  'notfound.viewProjects': string;
  'notfound.contact': string;
  'notfound.errorCodeLabel': string;
  'notfound.errorCode': string;
  'notfound.statusLabel': string;
  
  // Performance
  'performance.lowMode': string;
  'performance.highMode': string;
  'performance.animationsOff': string;
  'performance.animationsOn': string;
  'performance.clickToDeactivate': string;
  'performance.low': string;
  'performance.high': string;
  'performance.matrix': string;
  
  // Terminal Language
  'terminal.language': string;
  'terminal.selectLanguage': string;
  'terminal.active': string;
  'terminal.languageNote': string;
  'terminal.inputPlaceholder': string;
  
  // Terminal Commands
  'terminal.init': string;
  'terminal.systemInit': string;
  'terminal.portfolioLoaded': string;
  'terminal.developer': string;
  'terminal.status': string;
  'terminal.availability': string;
  'terminal.online': string;
  'terminal.stack': string;
  'terminal.location': string;
  'terminal.uptime': string;
  'terminal.years': string;
  'terminal.projects': string;
  'terminal.games': string;
  'terminal.helpProjects': string;
  'terminal.helpGames': string;
  'terminal.helpMatrix': string;
  'terminal.helpLanguage': string;
  'terminal.helpStatus': string;
  'terminal.gamesAvailable': string;
  'terminal.interactiveExperience': string;
  'terminal.easterEgg': string;
  'terminal.easterEggHint': string;
  'terminal.commandNotFound': string;
  'terminal.typeCommand': string;

  // Snake (Game modal labels)
  'snake.controlsTitle': string;
  'snake.pause': string;
  'snake.resume': string;
  'snake.reset': string;
  'snake.score': string;
  'snake.moveKeys': string;
  'snake.moveKeysMobile': string;
  'snake.pauseKey': string;
  'snake.pauseKeyMobile': string;
  'snake.escKey': string;
  'snake.escKeyMobile': string;
  'snake.requiresPerformance': string;
  'snake.comingSoon': string;
  'snake.gameOver': string;
  'snake.playAgain': string;
  'snake.paused': string;

  // Tetris
  'tetris.level': string;
  'tetris.lines': string;
  'tetris.moveKeys': string;
  'tetris.moveKeysMobile': string;
}

export const portfolioTranslations: Record<Language, PortfolioTranslations> = {
  es,
  en,
};
