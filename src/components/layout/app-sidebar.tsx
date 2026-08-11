'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tags, 
  Users, 
  Settings, 
  ChevronUp,
  User2,
  Bell,
  HelpCircle
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Categories', href: '/categories', icon: Tags },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post('/api/auth/logout');
      
      // Clear client side cookies if any non-httpOnly cookies exist
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      setShowLogoutDialog(false);
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar variant="inset" className="border-r border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-950/50">
      <SidebarHeader className="h-32 flex items-center justify-start border-b border-zinc-200/60 dark:border-zinc-800/60 px-6">
        <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="relative h-32 w-32 flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain object-left dark:brightness-110"
              priority
            />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      render={<Link href={item.href} className="flex items-center gap-3 w-full" />}
                      className={`
                        w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-out group
                        ${isActive 
                          ? 'bg-[#5030E5]/10 text-[#5030E5] dark:bg-[#5030E5]/20 dark:text-[#8c74e8] font-semibold' 
                          : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50 hover:translate-x-0.5'
                        }
                      `}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 transition-colors duration-200 ${isActive ? 'text-[#5030E5] dark:text-[#8c74e8]' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'}`} />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200/60 dark:border-zinc-800/60 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton className="w-full justify-between hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-all rounded-lg py-5 px-3 border border-transparent hover:border-zinc-200/60 dark:hover:border-zinc-800/60" />}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#5030E5] to-[#8c74e8] p-[1.5px] shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                      <User2 className="h-3.5 w-3.5 text-[#5030E5] dark:text-[#8c74e8]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">Admin User</span>
                    <span className="text-[10px] text-zinc-550 dark:text-zinc-400">admin@admin.com</span>
                  </div>
                </div>
                <ChevronUp className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-650" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] mb-2 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <DropdownMenuItem className="cursor-pointer text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  Support Help
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 text-xs cursor-pointer rounded-md transition-colors mt-1 border-t border-zinc-100 dark:border-zinc-900 pt-2"
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowLogoutDialog(true);
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your session? This will clear your authentication token and return you to the login screen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)} disabled={isLoggingOut}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
