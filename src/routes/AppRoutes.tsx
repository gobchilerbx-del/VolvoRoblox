import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import Panel from '@/pages/Panel';
import NotFound from '@/pages/NotFound';
import Affiliates from '@/pages/Affiliates';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
      <Route path="/afiliados" element={<Affiliates />} />
      <Route path="/panel" element={<Panel />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
