import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Trash2 } from 'lucide-react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function BookImageUploader({
  initialUrl,
  onUpload,
  isUploading = false,
  isUploaded = false,
}: {
  initialUrl?: string
  onUpload: (file: File) => void
  isUploading?: boolean
  isUploaded?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(false)

  const MIN_WIDTH = 300
  const MIN_HEIGHT = 450
  const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  const handleFile = (file: File) => {
    if (!VALID_TYPES.includes(file.type)) {
      setErrorMessage('Tipe gambar tidak valid. Hanya JPEG, PNG, atau WebP.')
      return
    }

    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        setUploaded(false)
        setErrorMessage(`Ukuran gambar minimal ${MIN_WIDTH}x${MIN_HEIGHT}px.`)
        return
      }

      setErrorMessage(null)
      setPreviewUrl(img.src)
      setUploaded(true)
      onUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleResetToInitial = () => {
    setPreviewUrl(initialUrl ?? null)
    inputRef.current!.value = ''
    setErrorMessage(null)
  }

  useEffect(() => {
    setPreviewUrl(initialUrl ?? null)
  }, [initialUrl])

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition relative"
    >

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg z-10">
          <div className="loader w-8 h-8 border-4 border-gray-300 rounded-full"></div>
        </div>
      )}

      {uploaded && isUploaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg animate-fade-out z-10">
          <CheckCircleIcon className="w-12 h-12 text-green-400 drop-shadow" />
        </div>
      )}

      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="Gambar Buku"
            className="w-32 h-48 object-cover rounded-lg mb-2"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleResetToInitial()
            }}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            title="Hapus gambar"
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

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  )
}
