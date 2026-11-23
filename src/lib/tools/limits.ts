/** Request limits for the tool APIs, shared by the routes and the /api index. */
export const LIMITS = {
  contrast: { get_pairs: 50, post_pairs: 200 },
  palette: { seeds: 12 },
  validate: { files: 20, total_kb: 512 },
  dark_mode: { roles: 120 },
} as const
