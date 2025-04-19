import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { 
  BarChart, Home, Activity, Lightbulb, User, Settings, Menu, X, Moon, Sun 
} from "lucide-react";
import { SiInstagram, SiTiktok, SiFacebook } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationBell } from "@/components/notifications";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

type SidebarProps = {
  children: React.ReactNode;
};

export function Sidebar({ children }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems: NavItem[] = [
    { path: "/", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { path: "/platforms", label: "Platforms", icon: <Activity className="h-5 w-5" /> },
    { path: "/insights", label: "AI Insights", icon: <Lightbulb className="h-5 w-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed lg:sticky top-0 h-full z-50 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col w-64 h-full border-r border-border bg-background">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <BarChart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SocialPulse</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <nav className="px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <a
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </Link>
              ))}
            </nav>
            
            <div className="px-4 py-2">
              <h3 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                Connected Platforms
              </h3>
              
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <SiInstagram className="h-4 w-4 text-[#E1306C]" />
                    <span>Instagram</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                    Connected
                  </span>
                </div>
                
                <div className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <SiTiktok className="h-4 w-4" />
                    <span>TikTok</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                    Connected
                  </span>
                </div>
                
                <div className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <SiFacebook className="h-4 w-4 text-[#1877F2]" />
                    <span>Facebook</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex-shrink-0 border-t border-border p-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  Sign out
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:inline-flex"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
