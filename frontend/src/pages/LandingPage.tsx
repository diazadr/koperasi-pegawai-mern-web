import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const slides = [
    "Monitoring transaksi real-time",
    "Visualisasi data interaktif",
    "Upload & analisis data bulanan",
  ];

  const [current, setCurrent] = useState(0);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const int = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
          else entry.target.classList.remove("show");
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="w-full py-4 px-8 flex justify-between items-center border-b dark:border-gray-800">
        <h1 className="text-2xl font-bold text-blue-600">Kelompok 4 — 3AEC 4</h1>
        <div className="flex items-center gap-6 text-lg">
          <nav className="space-x-6 hidden md:block">
            <a href="#about" className="hover:text-blue-600 transition">Tentang</a>
            <a href="#features" className="hover:text-blue-600 transition">Fitur</a>
            <a href="#tech" className="hover:text-blue-600 transition">Teknologi</a>
            <a href="#team" className="hover:text-blue-600 transition">Tim</a>
            <a href="#thanks" className="hover:text-blue-600 transition">Dosen</a>
          </nav>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            {darkMode ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <section
        className="relative flex items-center justify-center min-h-[100vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/bg/koperasi-bg.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-3xl text-center text-white px-4 py-10 reveal">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-xl">
            Sistem Big Data Koperasi Pegawai
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md">
            Platform analitik untuk memvisualisasikan transaksi dan mendukung keputusan secara modern berbasis data.
          </p>

          <div className="relative h-16 flex justify-center items-center text-xl font-semibold">
            {slides.map((text, i) => (
              <div
                key={i}
                className={`absolute transition-all duration-700 
                  ${i === current ? "opacity-100" : "opacity-0 translate-y-3"}`}
              >
                {text}
              </div>
            ))}
          </div>

          <Link
            to="/dashboard"
            className="mt-8 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xl shadow-lg transform transition hover:scale-105"
          >
            Masuk ke Sistem
          </Link>
        </div>
      </section>

      <section id="about" className="px-4 py-20 reveal">
        <h3 className="text-3xl font-bold text-center mb-6">Tentang Sistem</h3>
        <div className="flex justify-center mb-6">
          <img
            src="/images/logo/kopeg.svg"
            className="w-28 h-auto object-contain"
          />
        </div>
        <p className="max-w-3xl text-lg mx-auto text-center text-gray-700 dark:text-gray-300">
          Sistem ini dikembangkan sebagai platform analitik untuk Koperasi Pegawai, memungkinkan visualisasi data transaksi, pemantauan performa, peramalan penjualan, dan evaluasi stok secara modern menggunakan metode Big Data.
        </p>
      </section>

      <section id="features" className="px-4 py-20 bg-gray-50 dark:bg-gray-950">
        <h3 className="text-3xl font-bold text-center mb-12 reveal">Fitur Utama</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition reveal">
            <img
              src="/images/preview/pembelian.png"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h4 className="text-xl font-semibold mb-3">Analisis Transaksi</h4>
            <p>Dashboard pembelian, penjualan, stok, dan retur dalam satu tempat.</p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition reveal">
            <img
              src="/images/preview/penjualan.png"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h4 className="text-xl font-semibold mb-3">Prediksi & Insight Data</h4>
            <p>Peramalan barang terlaris berdasarkan pola historis transaksi.</p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition reveal">
            <img
              src="/images/preview/stok.png"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h4 className="text-xl font-semibold mb-3">Upload Data Otomatis</h4>
            <p>Import file Excel/CSV secara periodik untuk analisis lanjutan.</p>
          </div>
        </div>
      </section>

      <section id="tech" className="px-4 py-20 text-center reveal">
        <h3 className="text-3xl font-bold mb-8">Teknologi yang Digunakan</h3>
        <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-10">
          MERN Stack
        </p>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="flex flex-col items-center">
            <img
              src="/images/logo/mongodb.svg"
              className="h-16 w-16 mb-3 object-contain"
            />
            <span>MongoDB</span>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/logo/expressjs.svg"
              className="h-16 w-16 mb-3 object-contain"
            />
            <span>Express.js</span>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/logo/react.svg"
              className="h-16 w-16 mb-3 object-contain"
            />
            <span>React</span>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/logo/nodejs.svg"
              className="h-16 w-16 mb-3 object-contain"
            />
            <span>Node.js</span>
          </div>
        </div>
      </section>

<section id="team" className="px-4 py-20 text-center reveal">
  <h3 className="text-3xl font-bold mb-10">Tim Pengembang 3AEC-4</h3>

  <div className="w-full flex justify-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-5xl">

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center w-72">
        <span className="text-5xl mb-3">👤</span>
        <div className="text-lg font-semibold">Achmad Brilyan Syach</div>
        <div className="text-gray-500 dark:text-gray-300">223443072</div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center w-72">
        <span className="text-5xl mb-3">👤</span>
        <div className="text-lg font-semibold">Azka Shafa Eka Poetra</div>
        <div className="text-gray-500 dark:text-gray-300">223443074</div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center w-72">
        <span className="text-5xl mb-3">👤</span>
        <div className="text-lg font-semibold">Diaz Adriansyach</div>
        <div className="text-gray-500 dark:text-gray-300">2234437</div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center w-72">
        <span className="text-5xl mb-3">👤</span>
        <div className="text-lg font-semibold">Fadhliman Putra</div>
        <div className="text-gray-500 dark:text-gray-300">223443078</div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center w-72">
        <span className="text-5xl mb-3">👤</span>
        <div className="text-lg font-semibold">Muhammad Evra Ridjki</div>
        <div className="text-gray-500 dark:text-gray-300">223443084</div>
      </div>

    </div>
  </div>
</section>



      <section id="thanks" className="px-4 py-20 bg-gray-100 dark:bg-gray-900 text-center reveal">
        <h3 className="text-3xl font-bold mb-4">Penghargaan & Apresiasi</h3>
        <div className="flex justify-center mb-6">
          <img
            src="/images/logo/logo-polman.png"
            className="w-40 h-auto object-contain"
          />
        </div>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300">
          Dengan rasa hormat, kami mengucapkan terima kasih kepada
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {" "}
            Bapak Hadi Supriyanto, S.T., M.T.
          </span>{" "}
          atas bimbingan, dukungan, serta arahannya selama pengembangan sistem ini.
        </p>
      </section>

      <footer className="py-6 text-center border-t dark:border-gray-800 text-sm text-gray-500">
        © {new Date().getFullYear()} — Kelompok 4 — 3AEC 4
      </footer>
    </div>
  );
}
