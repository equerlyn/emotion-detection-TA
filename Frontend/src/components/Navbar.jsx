import { Link, NavLink } from "react-router-dom";
import InfoCard from "./InfoCard";

/**
 * Komponen navigasi tetap berada di atas layar
 * tanpa menutupi konten di bawahnya.
 */
const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center bg-blue-200 bg-opacity-50 px-4 py-4 backdrop-blur-sm">
      {/* Judul atau Label Navigasi */}
      <h1 className="text-2xl font-bold french-blue">
        <Link to="/">
          Emotion Detection
        </Link>
      </h1>

      {/* Link Navigasi */}
      <div className="flex items-center space-x-4">
        <NavLink
          className={({ isActive }) =>
            `px-3 text-lg font-medium rounded-full transition ${
              isActive
                ? "font-semibold sunglow"
                : "text-raisin-black"
            } hover:bg-gray-100`
          }
          to="/emotions"
        >
          Emotions
        </NavLink>

        {/* Ikon Informasi */}
        <div className="group relative">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 hover:bg-gray-100"
            title="Info"
          >
            <span className="text-sm">i</span>
          </button>

          {/* InfoCard Muncul Saat Hover */}
          <div className="absolute left-[-290px] mt-2 w-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <InfoCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
