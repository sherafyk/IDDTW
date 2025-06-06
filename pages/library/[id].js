import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TagChip from '../../components/TagChip';
import { getMediaAsset } from '../../lib/api';

export default function AssetDetail({ asset }) {
  if (!asset) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <p>Asset not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        {asset.file?.url && (
          <img src={asset.file.url} alt={asset.altText || asset.title} className="w-full mb-4" />
        )}
        <h1 className="text-2xl font-bold mb-2">{asset.title}</h1>
        <p className="mb-4">{asset.description}</p>
        <div className="flex flex-wrap gap-1">
          {asset.tags?.map((tag) => (
            <TagChip key={tag.id || tag} tag={tag} />
          ))}
        </div>
        {asset.source && (
          <a href={asset.source} className="text-blue-500 underline block mt-4">
            Source
          </a>
        )}
        {asset.file?.url && (
          <a href={asset.file.url} download className="inline-block bg-blue-500 text-white mt-4 px-4 py-2 rounded">
            Download
          </a>
        )}
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const asset = await getMediaAsset(params.id);
    return { props: { asset } };
  } catch (err) {
    console.error(err);
    return { props: { asset: null } };
  }
}
