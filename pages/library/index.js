import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AssetCard from '../../components/AssetCard';
import { getMediaAssets } from '../../lib/api';

export default function Library({ assets }) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { search, tag, page } = query;
  try {
    const data = await getMediaAssets({ search, tag, page });
    return { props: { assets: data.docs || [] } };
  } catch (err) {
    console.error(err);
    return { props: { assets: [] } };
  }
}
