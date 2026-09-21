
import { BrowserRouter, Route, Routes } from 'react-router'
import MainLayout from './components/layout/MainLayout'
import DashboardPage from './components/layout/DashboardPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />} />
        <Route index element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
