import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from '../Page/NotFound';
import Home from '../Page/Home';

function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: '/cart', element: <Cart /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
