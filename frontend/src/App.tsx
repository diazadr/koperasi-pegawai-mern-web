import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import Pembelian from "./pages/DataMenu/Pembelian";
import Penjualan from "./pages/DataMenu/Penjualan";
import Retur from "./pages/DataMenu/Retur";

import UploadBulanan from "./pages/DataPeriode/UploadBulanan";
import PeriodeList from "./pages/DataPeriode/Periode";
import StokOpname from "./pages/DataMenu/StokOpname";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/data/pembelian" element={<Pembelian />} />
            <Route path="/data/penjualan" element={<Penjualan />} />
            <Route path="/data/retur" element={<Retur />} />
            <Route path="/data/stokopname" element={<StokOpname />} />

            <Route path="/upload/bulanan" element={<UploadBulanan />} />
             <Route path="/upload/periode" element={<PeriodeList />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            \\

          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
