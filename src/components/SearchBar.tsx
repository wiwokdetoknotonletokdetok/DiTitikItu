export default function SearchBar({ onSearch }: { onSearch: (value: string) => void }) {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Cari judul buku..."
        onChange={(e) => onSearch(e.target.value)}
        className="border rounded px-2 py-1 flex-1"
      />
    </div>
  )
}
