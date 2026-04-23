export interface PostFrontmatter {
  title: string
  date: string
  summary: string
  tags: string[]
  draft?: boolean
}

export interface Post extends PostFrontmatter {
  slug: string
  path: string
  html: string
  headings: PostHeading[]
  showToc: boolean
}

export interface PageFrontmatter {
  title: string
  summary: string
}

export interface Page extends PageFrontmatter {
  slug: string
  path: string
  html: string
}

export interface PostHeading {
  id: string
  level: number
  text: string
}

export interface Tag {
  name: string
  slug: string
  path: string
  count: number
}
