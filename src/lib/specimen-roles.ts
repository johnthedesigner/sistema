/**
 * The color roles a project's tokens use (color.roles.required), each mapped to
 * the specimen role that shows it. The specimen response lists them as
 * `token_roles`, so the color play can take the stop the approved composition
 * used for each role without a hand-made mapping.
 */
export const TOKEN_ROLES: Record<string, string> = {
  surface: 'canvas',
  'surface-raised': 'surface',
  'surface-overlay': 'surface-overlay',
  'surface-subtle': 'surface-subtle',
  'surface-featured': 'surface-featured',
  'surface-hover': 'row-hover',
  'surface-selected': 'selected-row',
  'surface-inverse': 'surface-inverse',
  'on-surface-inverse': 'on-inverse',
  'surface-brand': 'surface-brand',
  'on-surface-brand': 'on-brand',
  'on-surface': 'text',
  'on-surface-muted': 'text-secondary',
  'on-surface-faint': 'text-tertiary',
  'on-surface-disabled': 'text-disabled',
  border: 'hairline',
  'border-strong': 'border-control',
  'border-focus': 'focus',
  primary: 'primary',
  'primary-hover': 'primary-hover',
  'on-primary': 'on-primary',
  'primary-container': 'accent-subtle',
  'on-primary-container': 'on-accent-subtle',
  link: 'link',
  'error-container': 'error-container',
  'on-error-container': 'on-error-container',
  'warning-container': 'warning-container',
  'on-warning-container': 'on-warning-container',
  'success-container': 'success-container',
  'on-success-container': 'on-success-container',
  'info-container': 'info-container',
  'on-info-container': 'on-info-container',
}
