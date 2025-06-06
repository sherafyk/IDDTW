import Link from 'next/link';
import TagChip from './TagChip';

export default function AssetCard({ asset }) {
  return (
    <div className="bg-white shadow rounded p-4">
      {asset.file?.url && (
        <Link href={`/library/${asset.id}`}> 
          <img src={asset.file.url} alt={asset.altText || asset.title} className="w-full h-48 object-cover mb-2" />
        </Link>
      )}
      <h3 className="font-semibold">{asset.title}</h3>
      <p className="text-sm text-gray-500">{asset.fileType}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {asset.tags?.map(tag => (
          <TagChip key={tag.id || tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
