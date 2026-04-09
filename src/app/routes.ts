import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import CheckIn from './pages/CheckIn';
import Routine from './pages/Routine';
import History from './pages/History';
import AICoach from './pages/AICoach';
import Products from './pages/Products';
import Analyzer from './pages/Analyzer';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: CheckIn },
      { path: 'routine', Component: Routine },
      { path: 'history', Component: History },
      { path: 'coach', Component: AICoach },
      { path: 'products', Component: Products },
      { path: 'analyzer', Component: Analyzer },
    ],
  },
]);
