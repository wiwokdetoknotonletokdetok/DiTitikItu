import SubmitButton from '@/components/SubmitButton.tsx'
import SettingsHeader from '@/components/SettingsHeader.tsx'

interface UpdateFieldFormProps {
  title: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
  buttonText: string
  children: React.ReactNode
  info?: React.ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  isValid?: boolean
  to?: string
}

const UpdateFieldForm = ({ to, isValid = true, isSuccess, isLoading, children, title, onSubmit, buttonText, info }: UpdateFieldFormProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SettingsHeader to={to}>
        {title}
      </SettingsHeader>
      <form className="max-w-md space-y-4" onSubmit={onSubmit}>
        <div>
          {children}
          {info}
        </div>
        <SubmitButton type="submit" isLoading={isLoading} disabled={isLoading || isSuccess || !isValid}>
          {!isSuccess ? buttonText : 'Tersimpan'}
        </SubmitButton>
      </form>
    </div>
  )
}

export default UpdateFieldForm
