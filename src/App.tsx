import { Routes, Route } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Calculator } from './pages/Calculator';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
