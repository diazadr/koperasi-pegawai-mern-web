import { Routes, Route } from "react-router-dom";
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
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route index path="/" element={<LandingPage />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/data/pembelian" element={<Pembelian />} />
          <Route path="/data/penjualan" element={<Penjualan />} />
          <Route path="/data/retur" element={<Retur />} />
          <Route path="/data/stokopname" element={<StokOpname />} />

          <Route path="/upload/bulanan" element={<UploadBulanan />} />
          <Route path="/upload/periode" element={<PeriodeList />} />
          <Route path="/profile" element={<UserProfiles />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
