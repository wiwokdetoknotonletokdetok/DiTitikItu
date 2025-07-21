import SubmitButton from '@/components/SubmitButton.tsx'

interface UpdateFieldFormProps {
  title: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
  buttonText: string
  children: React.ReactNode
}

const UpdateBookFieldForm = ({ children, title, onSubmit, buttonText }: UpdateFieldFormProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit {title}</h1>
      <form className="max-w-md space-y-4" onSubmit={onSubmit}>
        {children}
        <SubmitButton type="submit">
          {buttonText}
        </SubmitButton>
      </form>
    </div>
  )
}

export default UpdateBookFieldForm
