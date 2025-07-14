import type { BookLocationResponse } from '@/dto/BookLocationResponse'

export default function BookLocationList({ locations }: { locations: BookLocationResponse[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Lokasi Buku</h3>
      {locations.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada lokasi.</p>
      ) : (
        <ul className="list-disc ml-4 mt-2 space-y-1 text-sm">
          {locations.map(loc => (
            <li key={loc.id}>
              <strong>{loc.locationName}</strong> – ({loc.coordinates.join(', ')})  
              <span className="text-gray-500"> ({loc.distanceMeters.toFixed(1)} m)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
