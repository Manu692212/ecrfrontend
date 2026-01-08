import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { name: 'Home Page', path: '/admin/home', icon: '🏠' },
  { name: 'About Page', path: '/admin/about', icon: 'ℹ️' },
  { name: 'Courses', path: '/admin/courses', icon: '📚' },
  { name: 'Applications', path: '/admin/applications', icon: '🗂️' },
  { name: 'Academic Council', path: '/admin/academic-council', icon: '👥' },
  { name: 'Management', path: '/admin/management', icon: '🏢' },
  { name: 'Admission Page', path: '/admin/admission', icon: '📝' },
  { name: 'Careers Page', path: '/admin/careers', icon: '💼' },
  { name: 'Contact Page', path: '/admin/contact', icon: '✉️' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children?: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const currentMenuItem =
    menuItems.find((item) => location.pathname === item.path || location.pathname.startsWith(item.path)) ??
    menuItems[0];

  return (
    <div className="flex min-h-screen bg-background bg-hero-pattern text-foreground">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'} md:hidden`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background/95 border-r border-border shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <button
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-foreground">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-gray-500 hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-background/95 border-b border-border backdrop-blur">
          <div className="ecr-container flex h-16 items-center justify-between">
            <button
              type="button"
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Navigation</p>
                <h2 className="text-lg font-semibold text-gray-900">{currentMenuItem?.name || 'Dashboard'}</h2>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto py-6 sm:py-8">
          <div className="ecr-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
