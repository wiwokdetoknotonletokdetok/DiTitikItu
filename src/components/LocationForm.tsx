import { useCallback, useMemo, useState } from 'react'
import TextInput from '@/components/TextInput'
import SubmitButton from '@/components/SubmitButton'
import TextInputError from '@/components/TextInputError'
import { postBooksIdLocations } from '@/api/booksIdLocations.ts'
import { resetNewMarkerPosition } from '@/store/actions/newMarkerPositionActions.ts'
import { ApiError } from '@/exception/ApiError.ts'
import { fetchBookLocations } from '@/api/bookLocation.ts'
import { setSelectedBookLocations } from '@/store/actions/selectedBookLocationsActions.ts'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'

type LocationFormProps = {
  locationName: string
  setLocationName: (name: string) => void
}

const MAX_LOCATION_LENGTH = 50

export default function LocationForm({ locationName, setLocationName }: LocationFormProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userPosition = useSelector((state: RootState) => state.userPosition)
  const selectedBook = useSelector((state: RootState)=> state.selectedBook)
  const newMarkerPosition = useSelector((state: RootState) => state.newMarkerPosition)
  const [touched, setTouched] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateLocationName = useCallback(() => {
    if (!locationName.trim()) return 'Nama lokasi tidak boleh kosong'
    if (locationName.length > MAX_LOCATION_LENGTH) return `Nama lokasi tidak boleh lebih dari ${MAX_LOCATION_LENGTH} karakter`
    return ''
  }, [locationName])

  const errorMessage = useMemo(() => {
    if (!touched && !submitAttempted) return ''
    return validateLocationName()
  }, [locationName, touched, submitAttempted])

  const isValid = useMemo(() =>
    locationName !== '' &&
    errorMessage === '',
    [errorMessage, locationName]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value)
    setTouched(true)
  }

  async function handleNewLocation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!isValid) {
      return
    }

    setLoading(true)
    try {
      await postBooksIdLocations(selectedBook!.id, {
        locationName: locationName,
        latitude: newMarkerPosition!.latitude,
        longitude: newMarkerPosition!.longitude
      })
      navigate(-1)
      setLocationName('')
      await refreshLocations(selectedBook!.id)
      dispatch(resetNewMarkerPosition())
    } catch (err) {
      setLocationName('')
      dispatch(resetNewMarkerPosition())
      if (err instanceof ApiError && err.statusCode === 401) {
        console.log(err.message)
      } else {
        console.log('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshLocations = async (bookId: string) => {
    if (!userPosition) return
    const data = await fetchBookLocations(bookId, userPosition.latitude, userPosition.longitude)
    dispatch(setSelectedBookLocations(data))
  }

  return (
    <form onSubmit={handleNewLocation} className="space-y-4">
      <TextInput
        label="Nama lokasi"
        name="location"
        value={locationName}
        onChange={handleChange}
        placeholder="Masukkan nama lokasi"
        hasError={!!errorMessage}
        validation={errorMessage && <TextInputError message={errorMessage} />}
      />
      <SubmitButton
        type="submit"
        isLoading={loading}
        disabled={loading || (!isValid && touched)}>
        Simpan
      </SubmitButton>
    </form>
  )
}
