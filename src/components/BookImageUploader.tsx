import { useRef, useState} from 'react'
import { UploadCloud } from 'lucide-react'

export default function BookImageUploader({initialUrl, onUpload, isUploading = false}: {
  initialUrl?: string
  onUpload: (file: File) => void
  isUploading?: boolean
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
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition relative"
    >
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl z-10">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
        </div>
      )}

      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Preview" className="w-32 h-48 object-cover rounded-lg mb-2" />
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          >
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <UploadCloud size={40} className="mb-2" />
          <p className="text-sm">Tarik gambar ke sini atau klik untuk pilih</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        className="hidden"
        disabled={isUploading}
      />

      <style>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  )
}
