import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router";
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
                    <div className="container mx-auto px-4 py-10 text-center text-gray-400
                supports-[backdrop-filter]:bg-background/60">
                        <p>
                            Made By Pontusdemon
                        </p>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MainLayout;
