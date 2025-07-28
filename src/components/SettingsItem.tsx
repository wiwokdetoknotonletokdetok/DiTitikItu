import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface SettingsItemProps {
  title: string
  description: string
  icon?: React.ReactNode
  to?: string
  onClick?: () => void
  danger?: boolean
}

export default function SettingsItem({ title, description, icon, to, onClick, danger }: SettingsItemProps) {
  const content = (
    <div
      className={`flex items-center justify-between p-4 bg-white rounded-lg shadow transition ${
        danger ? 'hover:bg-red-50' : 'hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center space-x-4">
        {icon}
        <div>
          <p className={`text-sm font-medium ${danger ? 'text-red-600' : 'text-gray-800'}`}>
            {title}
          </p>
          <p className={`text-xs ${danger ? 'text-red-400' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>
  )

  if (to) {
    return (
      <Link className="block" to={to}>
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
