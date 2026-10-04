
import { BrowserRouter, Route, Routes } from "react-router"
import MainLayout from "./components/layout/MainLayout"
import DashboardPage from "./components/features/DashboardPage"
import MembersPage from "./components/features/MembersPage"
import ProjectDetailPage from "./components/features/ProjectDetailPage"
import ProjectsPage from "./components/features/ProjectsPage"
import SettingsPage from "./components/features/SettingsPage"
import TasksPage from "./components/features/TasksPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
