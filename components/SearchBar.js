import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState(router.query.search || '');

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/library?search=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 rounded-l px-2 py-1"
      />
      <button className="bg-blue-500 text-white px-3 rounded-r">Go</button>
    </form>
  );
}
