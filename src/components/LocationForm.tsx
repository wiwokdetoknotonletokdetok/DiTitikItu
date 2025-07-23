import { useCallback, useMemo, useState } from 'react'
import TextInput from '@/components/TextInput'
import SubmitButton from '@/components/SubmitButton'
import TextInputError from '@/components/TextInputError'

type LocationFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  locationName: string
  setLocationName: (name: string) => void
}

const MAX_LOCATION_LENGTH = 50

export default function LocationForm({ onSubmit, locationName, setLocationName}: LocationFormProps) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!isValid) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
