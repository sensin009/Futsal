import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { 
  Home, 
  Info, 
  Users, 
  Calendar, 
  Trophy, 
  LogIn, 
  UserPlus, 
  LogOut, 
  LayoutDashboard, 
  Shield,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
    isActive 
      ? "bg-accent/10 text-accent shadow-[0_0_20px_rgba(0,200,83,0.1)]" 
      : "text-white/60 hover:text-white hover:bg-white/5"
  }`;

export function PublicShell() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/about", label: "About", icon: Info },
    { to: "/players", label: "Players", icon: Users },
    { to: "/schedule", label: "Schedule", icon: Calendar },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-navy gradient-mesh">
      <header 
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-navy/80 py-3 backdrop-blur-lg border-b border-white/5 shadow-2xl" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">
              <Trophy className="h-6 w-6 text-navy" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-white">FUTSAL</span>
              <span className="text-xs font-bold tracking-[0.2em] text-accent">ARENA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button variant={user.role === "admin" ? "gold" : "primary"} size="sm" className="gap-2">
                    {user.role === "admin" ? <Shield className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                    {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="rounded-xl bg-white/5 p-2 text-white lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-x-0 top-full border-b border-white/10 bg-navy/95 p-6 backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.to} 
                    to={item.to} 
                    end={item.end} 
                    className={linkClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
                <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-white/10">
                  {user ? (
                    <>
                      <Link to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full gap-2" variant={user.role === "admin" ? "gold" : "primary"}>
                          {user.role === "admin" ? <Shield /> : <LayoutDashboard />}
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full gap-2" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                        <LogOut /> Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full gap-2">
                          <LogIn /> Login
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full gap-2">
                          <UserPlus /> Join Now
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-navy-dark py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <Trophy className="h-5 w-5 text-navy" />
                </div>
                <span className="text-lg font-black tracking-tighter text-white uppercase">Futsal Arena</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm text-white/50 leading-relaxed">
                The ultimate platform for futsal enthusiasts. Track matches, manage teams, 
                and climb the leaderboard in our premier tournament management system.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li><Link to="/schedule" className="hover:text-accent transition-colors">Match Schedule</Link></li>
                <li><Link to="/leaderboard" className="hover:text-accent transition-colors">Player Standings</Link></li>
                <li><Link to="/players" className="hover:text-accent transition-colors">Approved Players</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Rules & Regulations</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
            <p className="text-xs text-white/30">
              © 2026 Futsal Arena Platform. All rights reserved.
            </p>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
              <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
              <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
