
import { BrowserRouter, Route, Routes } from "react-router"
import MainLayout from "./components/layout/MainLayout"
import DashboardPage from "./components/fetaures/DashboardPage"
import MembersPage from "./components/fetaures/MembersPage"
import ProjectDetailPage from "./components/fetaures/ProjectDetailPage"
import ProjectsPage from "./components/fetaures/ProjectsPage"
import SettingsPage from "./components/fetaures/SettingsPage"
import TasksPage from "./components/fetaures/TasksPage"

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
