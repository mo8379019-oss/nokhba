import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TeamsPage } from "./pages/TeamsPage";
import { TeamDetailsPage } from "./pages/TeamDetailsPage";
import { SubjectDetailsPage } from "./pages/SubjectDetailsPage";
import { LectureDetailsPage } from "./pages/LectureDetailsPage";
import { SearchPage } from "./pages/SearchPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";

import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminUserDetailsPage } from "./pages/admin/AdminUserDetailsPage";
import { AdminTeamsPage } from "./pages/admin/AdminTeamsPage";
import { AdminSubjectsPage } from "./pages/admin/AdminSubjectsPage";
import { AdminLecturesPage } from "./pages/admin/AdminLecturesPage";
import { AdminBannersPage } from "./pages/admin/AdminBannersPage";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Student-facing routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
            <Route path="/teams/:teamId/subjects/:subjectId" element={<SubjectDetailsPage />} />
            <Route path="/lectures/:lectureId" element={<LectureDetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin routes (guarded inside AdminLayout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:id" element={<AdminUserDetailsPage />} />
            <Route path="teams" element={<AdminTeamsPage />} />
            <Route path="teams/:teamId/subjects" element={<AdminSubjectsPage />} />
            <Route path="subjects/:subjectId/lectures" element={<AdminLecturesPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
