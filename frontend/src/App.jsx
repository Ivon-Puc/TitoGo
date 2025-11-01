import './App.css'
// 1. REMOVA 'BrowserRouter' daqui:
import { Route, Routes } from 'react-router-dom' 
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import ShareForm from './pages/ShareForm'
import SearchPage from './pages/SearchPage'
import TripsPage from './pages/TripsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {

  return (
    <>
      {/* 2. APAGUE a tag <BrowserRouter> daqui */}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/share" element={<ProtectedRoute><ShareForm /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      {/* 3. APAGUE a tag </BrowserRouter> daqui */}
    </>
  )
}

export default App