
import { BrowserRouter, Route, Routes } from 'react-router'
import MainLayout from './components/layout/MainLayout'
import DashboardPage from './components/layout/DashboardPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Add these as you build the pages */}
          {/* <Route path="projects" element={<ProjectsPage />} /> */}
          {/* <Route path="tasks" element={<TasksPage />} /> */}
          {/* <Route path="members" element={<MembersPage />} /> */}
          {/* <Route path="settings" element={<SettingsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
