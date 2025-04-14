import { Outlet } from "react-router-dom"
import { ModeToggle } from "./components/mode-toggle"

const Layout = () => {
  return (
    <div>
        <header>
            <nav className="flex justify-between items-center bg-gray-200 dark:bg-gray-800 p-4 shadow-md">
                <ul className="flex space-x-4">
                    <li><a href="/">Home</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/publicationform">Form</a></li>
                </ul>
            <ModeToggle />
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
        <footer>
            <p>&copy; Field Project</p>
        </footer>
    </div>
  )
}

export default Layout