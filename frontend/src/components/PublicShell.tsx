import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-accent/20 text-accent" : "text-white/80 hover:text-white"
  }`;

export function PublicShell() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-grass">
      <header className="border-b border-white/10 bg-navy/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="text-lg font-bold tracking-tight text-white">
            Futsal <span className="text-accent">Arena</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/players" className={linkClass}>
              Players
            </NavLink>
            <NavLink to="/schedule" className={linkClass}>
              Schedule
            </NavLink>
            <NavLink to="/leaderboard" className={linkClass}>
              Leaderboard
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="rounded-md bg-gold px-3 py-2 text-sm font-semibold text-navy"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-navy"
                  >
                    My dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md border border-white/20 px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md border border-white/20 px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-navy"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 bg-navy/90 py-8 text-center text-sm text-white/60">
        Futsal club tournament platform — dark pitch theme
      </footer>
    </div>
  );
}
