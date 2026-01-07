import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Import Pages & Components ---
// --- FIX: Using absolute paths from /src/ ---
import { Header } from '/src/Components/Header.jsx';
import { Footer } from '/src/Components/Footer.jsx';
import { LoadingSpinner } from '/src/Components/LoadingSpinner.jsx';
import { HomePage } from '/src/Pages/HomePage.jsx';
import { AuthPage } from '/src/Pages/AuthPage.jsx';
import { PropertyDetailPage } from '/src/Pages/PropertyDetailPage.jsx';
import { AdminDashboard } from '/src/Pages/AdminDashboard.jsx';

// --- FIX: Using absolute paths from /src/ ---
import { AuthProvider, useAuthContext } from '/src/context/AuthContext.jsx';


/**
 * A layout component that wraps pages with the Header and Footer.
 */
const PageLayout = ({ children }) => {
  const auth = useAuthContext(); 
  
  if (auth.loading) {
      return (
          <div className="min-h-screen flex justify-center items-center bg-white">
              <LoadingSpinner />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header user={auth.user} onLogout={auth.logout} />
      <main className="flex-grow">
        {children ? React.cloneElement(children, { authContext: auth }) : null}
      </main>
      <Footer />
    </div>
  );
};

/**
 * NEW: UserProtectedRoute
 */
const UserProtectedRoute = ({ children }) => {
    const auth = useAuthContext();
    if (auth.loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <LoadingSpinner />
            </div>
        );
    }
    if (!auth.user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};


/**
 * RENAMED: AdminProtectedRoute
 */
const AdminProtectedRoute = ({ children }) => {
  const auth = useAuthContext();
  if (auth.loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }
  if (!auth.user || auth.user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

/**
 * NEW: PublicOnlyRoute
 */
const PublicOnlyRoute = ({ children }) => {
    const auth = useAuthContext();
    if (auth.loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <LoadingSpinner />
            </div>
        );
    }
    if (auth.user) {
        return <Navigate to="/" replace />;
    }
    return children;
};


/**
 * This is the new root component that contains the router logic.
 */
const AppRouter = () => {
    const auth = useAuthContext();

    if (auth.loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes (Login/Register) are now wrapped */}
                <Route 
                    path="/login" 
                    element={
                        <PublicOnlyRoute>
                            <PageLayout><AuthPage isRegister={false} /></PageLayout>
                        </PublicOnlyRoute>
                    } 
                />
                <Route 
                    path="/register" 
                    element={
                        <PublicOnlyRoute>
                            <PageLayout><AuthPage isRegister={true} /></PageLayout>
                        </PublicOnlyRoute>
                    } 
                />
                
                {/* Protected User Routes (Home, Property Details) */}
                <Route 
                    path="/" 
                    element={
                        <UserProtectedRoute>
                            <PageLayout><HomePage /></PageLayout>
                        </UserProtectedRoute>
                    } 
                />
                <Route 
                    path="/property/:id" 
                    element={
                        <UserProtectedRoute>
                            <PageLayout><PropertyDetailPage /></PageLayout>
                        </UserProtectedRoute>
                    } 
                />
                
                {/* Protected Admin Route */}
                <Route 
                    path="/admin" 
                    element={
                        <AdminProtectedRoute>
                            <PageLayout><AdminDashboard /></PageLayout>
                        </AdminProtectedRoute>
                    } 
                />
                
                {/* Fallback route: redirects to home if logged in, login if not */}
                <Route path="*" element={<Navigate to={auth.user ? "/" : "/login"} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

/**
 * Main App Component - sets up the router
 */
const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;