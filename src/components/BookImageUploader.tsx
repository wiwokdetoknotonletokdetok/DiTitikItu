import { useRef, useState } from 'react'
import { UploadCloud, Trash2 } from 'lucide-react'

export default function BookImageUploader({initialUrl, onUpload}: {
  initialUrl?: string
  onUpload: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return

    const maxSizeMB = 2
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Ukuran gambar maksimal ${maxSizeMB}MB`)
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onUpload(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleDelete = () => {
    setPreviewUrl(null)
    inputRef.current!.value = '' 
  }

  return (
    <div onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition relative">
      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Preview" className="w-32 h-48 object-cover rounded-lg mb-2" />
          <button onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <UploadCloud size={40} className="mb-2" />
          <p className="text-sm">Tarik gambar ke sini atau klik untuk pilih</p>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        className="hidden"
      />
    </div>
  )
}
