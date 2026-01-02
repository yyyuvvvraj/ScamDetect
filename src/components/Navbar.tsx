import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center">
      <span className="font-semibold">ScamDetect</span>

      <div className="flex items-center gap-6 text-sm">
        <Link to="/">Home</Link>
        <Link to="/analyze">Analyze</Link>
        <Link to="/history">History</Link>
        <Link to="/about">About</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
