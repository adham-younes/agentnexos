export const engagementIds = ['discovery', 'pilot', 'production', 'support'] as const;
export type Engagement = typeof engagementIds[number];

/** Reject unknown or ambiguous query values; a selection is always optional. */
export function parseEngagement(value: unknown): Engagement | '' {
    return engagementIds.find(id => id === value) ?? '';
}
