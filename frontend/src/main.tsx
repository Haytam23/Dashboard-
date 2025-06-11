// // src/main.tsx

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import App from './App';
// import { AuthProvider } from './AuthContext';
// import { ProtectedRoute } from './ProtectedRoute';
// import { LoginPage } from './LoginPage';
// import '@fullcalendar/core';
// import '@fullcalendar/timegrid';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public login page */}
//           <Route path="/login" element={<LoginPage />} />

//           {/* Everything else is behind the auth guard */}
//           <Route
//             path="/*"
//             element={
//               <ProtectedRoute>
//                 <App />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   </StrictMode>
// );
// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from './LoginPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
