import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import CreationPage from './pages/Creation/CreationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/creation" element={<CreationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
