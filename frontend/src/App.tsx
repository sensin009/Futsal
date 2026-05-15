import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicShell } from "./components/PublicShell";
import { useAuth } from "./context/AuthContext";
import { AboutPage } from "./pages/AboutPage";
import {
  AdminDashboardHome,
  AdminLayout,
  AdminLeaderboardPage,
  AdminMatchesPage,
  AdminPendingPage,
  AdminPlayersPage,
  AdminScoresPage,
  AdminTeamsPage,
} from "./pages/admin/AdminPages";
import {
  UserDashboardHome,
  UserDashboardLayout,
  UserEditProfilePage,
  UserProfilePage,
  UserScoresPage,
  UserStatsPage,
} from "./pages/dashboard/UserPages";
import { HomePage } from "./pages/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { LoginPage } from "./pages/LoginPage";
import { PlayersPage } from "./pages/PlayersPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SchedulePage } from "./pages/SchedulePage";
import { MatchDetailsPage } from "./pages/MatchDetailsPage";

function RequireAuth({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-navy text-white">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireAdmin({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-navy text-white">Loading…</div>;
  }
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="matches/:id" element={<MatchDetailsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardHome />} />
        <Route path="players" element={<AdminPlayersPage />} />
        <Route path="pending" element={<AdminPendingPage />} />
        <Route path="teams" element={<AdminTeamsPage />} />
        <Route path="matches" element={<AdminMatchesPage />} />
        <Route path="scores" element={<AdminScoresPage />} />
        <Route path="leaderboard" element={<AdminLeaderboardPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <UserDashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<UserDashboardHome />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="scores" element={<UserScoresPage />} />
        <Route path="stats" element={<UserStatsPage />} />
        <Route path="edit" element={<UserEditProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
