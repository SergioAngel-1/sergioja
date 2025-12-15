export const projectStatusValues = ['DRAFT', 'IN_PROGRESS', 'PUBLISHED'] as const;
export type ProjectStatus = typeof projectStatusValues[number];

export const isProjectStatus = (value: unknown): value is ProjectStatus =>
  typeof value === 'string' && (projectStatusValues as readonly string[]).includes(value);
