// Re-export shared types for main project
// This ensures type consistency across all subdomains

export type {
  ApiResponse,
  PaginatedResponse,
  Profile,
  Project,
  Skill,
  TimelineItem,
  ContactMessage,
  AnalyticsSummary,
} from '../../shared/types';
