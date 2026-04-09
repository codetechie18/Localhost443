import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import { Toaster } from "sonner";
// import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportIssue from "./pages/ReportIssue";
import MyComplaints from "./pages/MyComplaints";
import MapPage from "./pages/MapPage";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminMap from "./pages/AdminMap";
import AdminAnalytics from "./pages/AdminAnalytics";
// import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/map" element={<AdminMap />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<CitizenDashboard />} />
      <Route path="/report" element={<ReportIssue />} />
      <Route path="/complaints" element={<MyComplaints />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider> */}
      {/* <Sonner /> */}
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
