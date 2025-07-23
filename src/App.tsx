import {useRoutes} from 'react-router-dom'
import routes from '~react-pages'
import { Toaster } from 'react-hot-toast'

function App() {
  const element = useRoutes(routes)

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} containerStyle={{ top: '80px' }} />
      {element}
    </>
  )
}

export default App
