import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TagChip from '../../components/TagChip';
import { getTags } from '../../lib/api';

export default function TagsPage({ tags }) {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Tags</h1>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagChip key={tag.id || tag} tag={tag} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const data = await getTags();
    return { props: { tags: data.docs || [] } };
  } catch (err) {
    console.error(err);
    return { props: { tags: [] } };
  }
}
