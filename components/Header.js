import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Xaio</Link>
        <SearchBar />
      </div>
    </header>
  );
}
