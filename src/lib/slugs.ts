export function slugify(value: string, fallback = 'item') {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || fallback
}
