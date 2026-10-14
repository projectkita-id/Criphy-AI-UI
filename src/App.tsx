import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import ContextSelection from "./pages/ContextSelection";
import Assessment from "./pages/Assessment";
import LearningSession from "./pages/LearningSession";
import Results from "./pages/Results";
import LearningHistory from "./pages/LearningHistory";
import LearningHistoryDetail from "./pages/LearningHistoryDetail";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AssessmentManagement from "./pages/admin/AssessmentManagement";
import AIConfiguration from "./pages/admin/AIConfiguration";
import CaseStudyManagement from "./pages/admin/CaseStudyManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import StudentDetail from "./pages/admin/StudentDetail";
import MonitoringDashboard from "./pages/admin/MonitoringDashboard";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
            <Route element={<StudentLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/learn" element={<ContextSelection />} />

              <Route
                path="/learn/pre-test"
                element={<Assessment type="pre-test" />}
              />

              <Route
                path="/learn/session"
                element={<LearningSession />}
              />

              <Route
                path="/learn/post-test"
                element={<Assessment type="post-test" />}
              />

              <Route
                path="/history"
                element={<LearningHistory />}
              />

              <Route
                path="/history/:historyId"
                element={<LearningHistoryDetail />}
              />

              <Route path="/results" element={<Results />} />

              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Administrator routes */}
          <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route
                path="assessments"
                element={<AssessmentManagement />}
              />

              <Route
                path="ai-config"
                element={<AIConfiguration />}
              />

              <Route
                path="cases"
                element={<CaseStudyManagement />}
              />

              <Route
                path="students"
                element={<StudentManagement />}
              />

              <Route
                path="students/:studentId"
                element={<StudentDetail />}
              />

              <Route
                path="monitoring"
                element={<MonitoringDashboard />}
              />

              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Default */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}