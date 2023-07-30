import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import UserPage from './Pages/User';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />}/>
        <Route path="/user-info" element={<UserPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
