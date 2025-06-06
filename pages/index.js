import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to xaio.org</h1>
        <p className="mb-6">Explore our AI-enhanced digital asset library.</p>
        <Link href="/library" className="text-blue-500 underline">
          Browse Library
        </Link>
      </main>
      <Footer />
    </>
  );
}
