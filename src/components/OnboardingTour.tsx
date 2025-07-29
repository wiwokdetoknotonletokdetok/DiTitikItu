import { type RefObject, useEffect, useState } from 'react'
import { ONBOARDING_VERSION } from '@/pages'

interface OnboardingTourProps {
  step: number
  setStep: (step: number) => void
  locateMeRef?: RefObject<HTMLElement | null>
  searchBarRef?: RefObject<HTMLElement | null>
  addBookRef?: RefObject<HTMLElement | null>
}

const onboardingMessages = [
  {
    title: '👋 Selamat datang di DiTitikItu!',
    description:
      'Ini adalah peta interaktif untuk berbagi lokasi buku yang bisa diakses publik — seperti perpustakaan umum, taman baca, atau ruang baca lainnya.',
  },
  {
    title: '📚 Jelajahi Buku',
    description:
      'Gunakan pencarian ini untuk mencari buku atau melihat daftar buku yang telah ditambahkan oleh pengguna lain. Klik satu buku untuk melihat di mana saja tersedia!',
  },
  {
    title: '➕ Tambah Lokasi Buku',
    description:
      'Kalau kamu tahu lokasi buku tersedia di tempat umum, kamu bisa menambahkannya. Tentukan titik pada peta dan isi formulir lokasi — bantu orang lain menemukan literasi!',
  },
  {
    title: '📍 Temukan Lokasimu',
    description:
      'Klik tombol ini untuk memusatkan peta ke lokasimu sekarang. Ini akan membantumu melihat titik buku di sekitarmu.',
  },
  {
    title: '🌟 Terima kasih!',
    description:
      'Kontribusimu membantu membangun peta literasi bersama komunitas. Yuk, mulai jelajahi!',
  },
]

export default function OnboardingTour({
  step,
  setStep,
  locateMeRef,
  searchBarRef,
  addBookRef
}: OnboardingTourProps) {
  const [highlightRect, setHighlightRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })

  const updateHighlightRect = (ref: React.RefObject<HTMLElement | null>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setHighlightRect({
        top: rect.top + window.scrollY - 8,
        left: rect.left + window.scrollX - 8,
        width: rect.width + 16,
        height: rect.height + 16,
      })
    }
  }

  useEffect(() => {
    const isOnboardingActive = step !== -1

    if (isOnboardingActive) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [step])

  useEffect(() => {
    if (step === 1 && searchBarRef?.current) {
      updateHighlightRect(searchBarRef)
    } else if (step === 2 && addBookRef?.current) {
      updateHighlightRect(addBookRef)
    } else if (step === 3 && locateMeRef?.current) {
      updateHighlightRect(locateMeRef)
    } else {
      setHighlightRect({ top: 0, left: 0, width: 0, height: 0 })
    }
  }, [step])

  useEffect(() => {
    const handleResize = () => {
      if (step === 1 && searchBarRef?.current) {
        updateHighlightRect(searchBarRef)
      } else if (step === 2 && addBookRef?.current) {
        updateHighlightRect(addBookRef)
      } else if (step === 3 && locateMeRef?.current) {
        updateHighlightRect(locateMeRef)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [step])

  const skip = () => {
    localStorage.setItem('onboardingVersion', ONBOARDING_VERSION)
    setStep(-1)
  }

  const prev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const next = () => {
    if (step >= onboardingMessages.length - 1) {
      localStorage.setItem('onboardingVersion', ONBOARDING_VERSION)
      setStep(-1)
    } else {
      setStep(step + 1)
    }
  }

  if (step < 0 || step >= onboardingMessages.length) return null

  const { title, description } = onboardingMessages[step]

  const { top, left, width, height } = highlightRect

  const clipPath = `
    polygon(
      0 0,
      100% 0,
      100% 100%,
      0% 100%,
      0 0,
      ${left}px ${top}px,
      ${left}px ${top + height}px,
      ${left + width}px ${top + height}px,
      ${left + width}px ${top}px,
      ${left}px ${top}px
    )
  `

  return (
    <>
      <div
        className="fixed inset-0 z-[5000] pointer-events-none transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          clipPath,
        }}
      />

      <div className="fixed inset-0 z-[5001] flex items-center justify-center">
        <div className="bg-white shadow-xl p-6 rounded-lg max-w-md w-full mx-4">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-sm text-gray-700">{description}</p>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={skip} className="text-sm text-gray-500 hover:underline">
              Lewati
            </button>
            <div>
              {step > 0 && (
                <button
                  onClick={prev}
                  className="px-4 py-2 text-[#1E497C] font-medium"
                >
                  Kembali
                </button>
              )}
              <button
                onClick={next}
                className="px-4 py-2 bg-[#1E497C] text-white font-medium rounded-md hover:hover:bg-[#5C8BC1] transition duration-200 ease-in-ou"
              >
                {step >= onboardingMessages.length - 1 ? 'Selesai' : 'Lanjut'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
