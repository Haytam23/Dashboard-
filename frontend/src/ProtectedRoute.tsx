// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from './AuthContext';

// export function ProtectedRoute({ children }: React.PropsWithChildren<{}>) {
//   const { token } = useContext(AuthContext);
//   if (!token) return <Navigate to="/login" />;
//   return <>{children}</>;
// }
// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthed, isLoading } = useAuth();
  
  // Debug logging
  console.log('🛡️ ProtectedRoute check:', { isAuthed, isLoading, 
    safari: /Safari/.test(navigator.userAgent), 
    fallback: localStorage.getItem('auth-safari-fallback') 
  });
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('🛡️ ProtectedRoute: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthed) {
    console.log('🛡️ ProtectedRoute: Redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }
  
  console.log('🛡️ ProtectedRoute: Allowing access to protected content');
  return <>{children}</>;
}
