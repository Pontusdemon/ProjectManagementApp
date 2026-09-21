import {
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
} from "lucide-react"
import { NavLink, useLocation } from "react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Tasks", to: "/tasks", icon: ListTodo },
  { label: "Members", to: "/members", icon: Users },
  { label: "Settings", to: "/settings", icon: Settings },
]

const AppSidebar = () => {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-3">
          <p className="text-lg font-bold group-data-[collapsible=icon]:hidden">
            TaskFlow
          </p>
          <p className="hidden text-lg font-bold group-data-[collapsible=icon]:block">
            TF
          </p>
          <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Project manager
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ label, to, icon: Icon }) => {
                const isActive =
                  to === "/" ? pathname === "/" : pathname.startsWith(to)

                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      render={<NavLink to={to} end={to === "/"} />}
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Pontus">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                P
              </div>
              <span>Pontus</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
