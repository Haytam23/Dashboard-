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
  const { isAuthed } = useAuth();
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
