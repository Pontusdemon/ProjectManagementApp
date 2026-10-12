import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GitBranch } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { Link, Outlet } from "react-router";
import Header from "./Header";

const MainLayout = () => {
    return (
        <SidebarProvider defaultOpen>
            <AppSidebar />

            <SidebarInset>
                <Header />

                <main className="flex-1">
                    <Outlet />
                </main>

                <footer className="border-t backdrop-blur">
                    <div className="container mx-auto px-4 py-10 text-center text-muted-foreground bg-background/60">
                        <p>
                            Made By Pontusdemon
                            <Link to="https://github.com/Pontusdemon">
                                <GitBranch aria-hidden="true" className="inline size-4" />
                            </Link>
                        </p>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MainLayout;
