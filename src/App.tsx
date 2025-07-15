import {useRoutes} from 'react-router-dom'
import routes from '~react-pages'
import MainLayout from './layouts/MainLayout';

function App() {
  const element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: routes,
    },
  ]);

  return element;
}

export default App
