import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
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
                    <div className="container mx-auto px-4 py-10 text-center text-gray-400
                supports-[backdrop-filter]:bg-background/60">
                        <p>
                            Made By Pontusdemon
                            <Link to="https://github.com/Pontusdemon">
                                <FontAwesomeIcon icon={faGithub} />
                            </Link>
                        </p>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MainLayout;
