import { Navbar } from './Navbar';
import {Sidebar} from "./SideBar";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
