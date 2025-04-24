import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home';
import TravelStoriesPage from "./pages/TravelStoriesPage";

const Root = () => {
  const isAuthenticated = localStorage.getItem('Token');

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} /> {/* Ensure this is inside <Routes> */}
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/travel-stories" element={<TravelStoriesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
