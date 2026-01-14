export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export const sortData = <T extends Record<string, unknown>>(
  data: T[],
  config: SortConfig | null,
): T[] => {
  if (!config) return data;

  return [...data].sort((a, b) => {
    const aValue = a[config.key];
    const bValue = b[config.key];

    if (aValue === undefined || bValue === undefined || aValue === null || bValue === null)
      return 0;

    // Handle primitive comparisons safely
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return config.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return config.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (String(aValue) < String(bValue)) return config.direction === 'asc' ? -1 : 1;
    if (String(aValue) > String(bValue)) return config.direction === 'asc' ? 1 : -1;
    return 0;
  });
};
