import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import CreationPage from './pages/Creation/CreationPage';
import WorkloadPage from './pages/Workload/WorkloadPage';
import WorkloadDetailPage from './pages/Workload/WorkloadDetailPage';
import PersonalExpensePage from './pages/Expense/PersonalExpensePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reportcreate" element={<CreationPage />} />
        <Route path="/workload" element={<WorkloadPage />} />
        <Route path="/workload/detail/:id" element={<WorkloadDetailPage />} />
        <Route path="/expense" element={<PersonalExpensePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
