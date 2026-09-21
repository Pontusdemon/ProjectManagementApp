import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme-provider";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"

    return (
        <header className="flex h-16 shrink-0 items-center border-b px-4">
            <SidebarTrigger />

            <h1 className="ml-2 font-semibold">TaskFlow</h1>

            <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="ml-auto flex items-center rounded-md p-2 outline outline-1 outline-transparent transition-[outline-color] duration-200 hover:outline-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
                <span
                    className={`inline-flex transition-all duration-500 ${isDark ? "rotate-180" : "rotate-0"}`}
                >
                    {isDark ? (
                        <Sun className="h-6 w-6 text-yellow-500" />
                    ) : (
                        <Moon className="h-6 w-6 text-blue-500" />
                    )}
                </span>
            </button>
        </header>
    )
}

export default Header;
