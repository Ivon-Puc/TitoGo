import './App.css'
import { Route, Routes } from 'react-router-dom' 
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import ShareForm from './pages/ShareForm'
import SearchPage from './pages/SearchPage'
import TripsPage from './pages/TripsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
// (O seu Footer, se tiver um)
// import Footer from './components/Footer' 

function App() {

  return (
    // [MUDANÇA] Trocámos o <> por um <div> com classes
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-50">
      {/* O Header fica fora do 'main' */}
      <Header />
      
      {/* O 'main' agora guarda o conteúdo da página */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/share" element={<ProtectedRoute><ShareForm /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* (Se tiver um Footer, ele viria aqui) */}
      {/* <Footer /> */}
    </div>
  )
}

export default App