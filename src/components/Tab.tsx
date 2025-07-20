import { useState, ReactNode, ReactElement, Children, isValidElement, cloneElement } from 'react'

interface TabProps {
  children: ReactNode
  defaultTab?: string
}

interface TabButtonProps {
  id: string
  children: ReactNode
}

interface TabPanelProps {
  id: string
  children: ReactNode
}

export function Tab({ children, defaultTab }: TabProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const buttons = Children.toArray(children).filter(child => isValidElement(child) && (child.type as any).displayName === 'TabButton') as ReactElement<TabButtonProps>[]
  const panels = Children.toArray(children).filter(child => isValidElement(child) && (child.type as any).displayName === 'TabPanel') as ReactElement<TabPanelProps>[]

  const currentActiveTab = activeTab || (buttons.length > 0 ? buttons[0].props.id : undefined)

  return (
    <div>
      <div className="flex justify-evenly gap-x-8 border-b mb-4">
        {buttons.map(button =>
          cloneElement(button, {
            key: button.props.id,
            active: button.props.id === currentActiveTab,
            onClick: () => setActiveTab(button.props.id)
          })
        )}
      </div>

      <div>
        {panels.map(panel =>
          panel.props.id === currentActiveTab ? <div key={panel.props.id}>{panel.props.children}</div> : null
        )}
      </div>
    </div>
  )
}

export function TabButton({id, children, active, onClick}: TabButtonProps & { active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 text-sm font-medium ${
        active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
      }`}
    >
      {children}
    </button>
  )
}
TabButton.displayName = 'TabButton'

export function TabPanel({ id, children }: TabPanelProps) {
  return <>{children}</>
}
TabPanel.displayName = 'TabPanel'
