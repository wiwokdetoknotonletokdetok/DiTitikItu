interface InnerContainerProps {
  children: React.ReactNode
}

export default function InnerContainer({ children }: InnerContainerProps) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {children}
    </div>
  )
}
