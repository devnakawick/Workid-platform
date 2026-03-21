import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LinksPage from './pages/LinksPage'
import MarketingPage from './pages/MarketingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage - Links Page (like Sotercare) */}
        <Route path="/" element={<LinksPage />} />
        
        {/* Full Marketing Website */}
        <Route path="/website" element={<MarketingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
