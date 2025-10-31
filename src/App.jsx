import { Link, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Dashboard from './components/dashboard/Dashboard.jsx'
import ChatIA from './components/ia/ChatIA.jsx'

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: 12, padding: 12 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/ia">IA</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ia" element={<ChatIA />} />
        <Route path="*" element={<div style={{ padding: 16 }}>Ruta no encontrada</div>} />
      </Routes>
    </>
  )
}

export default App
