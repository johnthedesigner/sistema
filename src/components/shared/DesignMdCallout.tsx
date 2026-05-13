export function DesignMdCallout() {
  return (
    <div className="flex items-start gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-sm">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">ℹ</span>
      <p className="text-gray-600">
        <strong className="text-gray-800 font-medium">What is DESIGN.md?</strong>{' '}
        A plain-text file that describes a design system&apos;s visual language — colors, typography,
        spacing, components — in a format AI coding tools can read and act on. Introduced by Google Stitch.{' '}
        <a
          href="https://stitch.withgoogle.com/docs/design-md/format/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
        >
          Read the spec →
        </a>
      </p>
    </div>
  )
}
