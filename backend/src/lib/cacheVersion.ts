import { logger } from './logger';

let projectCacheVersion = Date.now();

export function getProjectCacheVersion(): number {
  return projectCacheVersion;
}

export function bumpProjectCacheVersion(reason?: string): number {
  projectCacheVersion = Date.now();
  logger.info('Project cache version bumped', {
    version: projectCacheVersion,
    reason,
  });
  return projectCacheVersion;
}
