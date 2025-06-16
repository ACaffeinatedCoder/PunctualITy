import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainLandingPage from './MainLanding';
import ClockIn from './pages/ClockIn';
import ClockOut from './pages/ClockOut';
import Records from './pages/analytics/Records';
import ProtectedRoute from './ProtectedRoutes';
import UnauthorizedPage from './Unauthorized';

/**
 * Filter Records, Sort Records*
 * Analytics Page
 * -- Compare IDs with Names *
 * -- Spot Anomalous Time-In and Time-Out *
 * --- Incomplete Clocking: Time-In Only or Time-Out Only *
 * -- Compare Records with Events *
 * 
 * Analysis:
 *    Records of Tardiness *
 *    Records of Absences *
 * 
 * Authentication
 * -- Match Credentials with Records *
 * -- Per Clocking, log Credentials as well *
 */

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLandingPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route path="/clockin" element={<ClockIn />} />
        <Route path="/clockout" element={<ClockOut />} />
      </Route>
      <Route element={<ProtectedRoute requiredRole='admin'/>}>
        <Route path="/records" element={<Records />} />
      </Route>
    </Routes>
  );
}

export default App;
