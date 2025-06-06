import Link from 'next/link';

export default function TagChip({ tag }) {
  if (!tag) return null;
  const name = tag.name || tag;
  const slug = tag.slug || tag;
  return (
    <Link href={`/library?tag=${encodeURIComponent(slug)}`} className="bg-gray-200 rounded px-2 py-1 text-xs">
      {name}
    </Link>
  );
}
