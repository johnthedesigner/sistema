export type ContentType = 'guidance' | 'implementation' | 'asset' | 'design-md'
export type ContentStatus = 'latest' | 'legacy' | 'draft' | 'deprecated'

export interface ContentFrontmatter {
  system: string
  category?: string
  topic: string
  content_type: ContentType
  status: ContentStatus
  version_label?: string
  retrieved: string
  source_url?: string
  derived_from?: string[]
  unofficial?: boolean
  design_md_spec_version?: string
  supersedes?: string
  superseded_by?: string
  tags?: string[]
  [key: string]: unknown
}

export interface StubFrontmatter {
  type: 'stub'
  points_to: string
  updated: string
}

export interface ContentFile {
  frontmatter: ContentFrontmatter
  body: string
  /** Absolute path to the versioned file on disk */
  filePath: string
  /** Stub-relative path used to reach this file, e.g. "material/guidance/foundations/color-system" */
  stubPath: string
  /** True when the source file is JSON (asset files) — body is a formatted JSON string */
  isJson: boolean
}

export interface SystemIndex {
  /** Raw markdown body of _index.md */
  body: string
  slug: string
}

export interface Play {
  slug: string
  title: string
  /** 1=System definition, 2=Primitive tokens, 3=Semantic layer, 4=Components, 5=Migration */
  stage: 1 | 2 | 3 | 4 | 5
  tags: string[]
  /** Copyable prompt text. May contain {{sistema_url}} placeholder. */
  body: string
}
