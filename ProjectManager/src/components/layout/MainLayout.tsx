import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MarkGithubIcon } from "@primer/octicons-react/MarkGithubIcon";
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
                    <div className="container mx-auto px-4 py-10 text-center text-muted-foreground bg-background/60">
                        <p className="inline-flex items-center justify-center gap-2">
                            Made By Pontusdemon
                            <a className="inline-flex items-center" href="https://github.com/Pontusdemon" aria-label="GitHub profile">
                                <MarkGithubIcon aria-hidden="true" size="small" />
                            </a>
                        </p>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MainLayout;
