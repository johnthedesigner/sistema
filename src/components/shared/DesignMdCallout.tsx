export function DesignMdCallout() {
  return (
    <div className="flex items-start gap-3 border border-border rounded-radius-lg px-4 py-3 bg-surface text-sm">
      <span className="text-on-surface-muted mt-0.5 flex-shrink-0">ℹ</span>
      <p className="text-on-surface-muted">
        <strong className="text-on-surface font-medium">What is DESIGN.md?</strong>{' '}
        A plain-text file that describes a design system&apos;s visual language — colors, typography,
        spacing, components — in a format AI coding tools can read and act on. Introduced by Google Stitch.{' '}
        <a
          href="https://stitch.withgoogle.com/docs/design-md/format/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface underline underline-offset-2 hover:text-on-surface-muted transition-colors"
        >
          Read the spec →
        </a>
      </p>
    </div>
  )
}
