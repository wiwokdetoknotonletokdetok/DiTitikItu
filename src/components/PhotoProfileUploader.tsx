import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function PhotoProfileUploader({
  initialUrl,
  onUpload,
  onDelete,
  isUploading = false,
  isUploaded = false,
}: {
  initialUrl?: string
  onUpload: (file: File) => void
  onDelete?: () => void
  isUploading?: boolean
  isUploaded?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)
  const [, setUploadedFile] = useState<File | null>(null)
  const [uploaded, setUploaded] = useState(false)
  const MIN_WIDTH = 320;
  const MIN_HEIGHT = 320;
  const { user } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFile = (file: File) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Hanya gambar JPG, JPEG, WebP, atau PNG yang diperbolehkan.")
      setUploaded(false)
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        setErrorMessage(`Ukuran gambar minimal ${MIN_WIDTH}x${MIN_HEIGHT} piksel.`);
        return;
      }
      
      setErrorMessage(null)
      setPreviewUrl(img.src)
      setUploadedFile(file)
      setUploaded(true)
      onUpload(file)
    };
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
    }
  
  const handleDelete = async () => {
    if (onDelete) {
      setUploaded(false)
      await onDelete?.()
    }
    setPreviewUrl(user?.profilePicture ?? null)
    setErrorMessage(null)
  }
  
  useEffect(() => {
    setPreviewUrl(initialUrl ?? null)
  }, [initialUrl])
  
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (uploaded) {
      setShowIcon(true)
      const timeout = setTimeout(() => {
        setShowIcon(false)
        const hideTimeout = setTimeout(() => setUploaded(false), 300) // delay hapus komponen
        return () => clearTimeout(hideTimeout)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [uploaded])
  
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

      {uploaded && isUploaded && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${
            showIcon ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <CheckCircleIcon className="w-12 h-12 text-green-400 drop-shadow" />
        </div>
      )}

      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="Foto Profil"
            className="w-32 h-32 object-cover rounded-full mb-2"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 z-20"
          >
            <Trash2 size={18} />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <UploadCloud size={40} className="mb-2" />
          <p className="text-sm">Tarik foto ke sini atau klik untuk pilih</p>
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
