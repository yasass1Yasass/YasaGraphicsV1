import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full py-4 bg-gray-100 text-center mt-8 border-t">
      <div className="flex justify-center items-center gap-4">
        <span className="text-gray-600">© 2025 EcoVenture</span>
        <Link
          to="/admin"
          className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
