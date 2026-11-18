/** Request limits for the tool APIs, shared by the routes and the /api index. */
export const LIMITS = {
  contrast: { get_pairs: 50, post_pairs: 200 },
  palette: { seeds: 12 },
} as const
