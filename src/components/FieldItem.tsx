import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BookItemProps<T> {
  label: string
  value: string
  to?: string
  onClick?: () => void
  state: { value: T }
}

function FieldItemSkeleton({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow hover:bg-gray-100">
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-sm font-medium text-gray-800">
            {label}
          </p>
          <div className="animate-pulse bg-gray-200 h-3 w-32 rounded mt-1"></div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400"/>
    </div>
  )
}

export default function FieldItem<T>({state, label, value, to, onClick}: BookItemProps<T>) {
  const content = (
    <div className="flex items-center justify-between p-4 bg-white shadow transition hover:bg-gray-100">
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-sm font-medium text-gray-800">
            {label}
          </p>
          <p className="text-xs text-gray-500">
            {value}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>
  )

  if (to) {
    return (
      <Link className="block" to={to} state={state}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {content}
    </button>
  )
}

export function FieldItemWithLoading<T>({ isLoading, ...props }: { isLoading: boolean } & BookItemProps<T>) {
  if (isLoading) {
    return <FieldItemSkeleton label={props.label} />
  }

  return <FieldItem {...props} />
}
