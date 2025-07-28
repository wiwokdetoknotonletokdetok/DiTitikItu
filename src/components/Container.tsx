interface ContainerProps {
  children: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-7xl px-4 mx-auto">
      {children}
    </div>
  )
}
