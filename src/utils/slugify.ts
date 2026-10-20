// Turns "ABC Inc." into "abc-inc".
export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return slug || 'org'; 
}

export async function generateUniqueSlug(
  name: string,
  isTaken: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;

  while (await isTaken(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

