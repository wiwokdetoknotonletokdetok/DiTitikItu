import SubmitButton from '@/components/SubmitButton.tsx'

interface UpdateFieldFormProps {
  title: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
  buttonText: string
  children: React.ReactNode
  info?: React.ReactNode
}

const UpdateFieldForm = ({ children, title, onSubmit, buttonText, info }: UpdateFieldFormProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{title}</h1>
      <form className="max-w-md space-y-4" onSubmit={onSubmit}>
        <div>
          {children}
          {info}
        </div>
        <SubmitButton type="submit">
          {buttonText}
        </SubmitButton>
      </form>
    </div>
  )
}

export default UpdateFieldForm
