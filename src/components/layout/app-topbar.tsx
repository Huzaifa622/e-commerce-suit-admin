'use client';

import { Search, User, Bell, HelpCircle, Calendar, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppTopbar() {
  return (
    <header className="flex h-18 items-center gap-4 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 px-6 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <SidebarTrigger className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg p-2" />
      
      {/* Search Bar */}
      <div className="w-full flex-1">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#787486] dark:text-zinc-500" />
            <Input
              type="search"
              placeholder="Search for anything..."
              className="w-full appearance-none bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 pl-9 pr-4 py-1.5 text-xs rounded-lg shadow-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus:bg-white dark:focus:bg-zinc-950 transition-all placeholder:text-[#787486] dark:placeholder:text-zinc-500"
            />
          </div>
        </form>
      </div>

      {/* Action Icons & Profile */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Calendar Icon */}
        <Button variant="ghost" size="icon" className="h-9 w-9 text-[#787486] dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
          <Calendar className="h-5 w-5" />
          <span className="sr-only">Calendar</span>
        </Button>

        {/* Message-Question Icon */}
        <Button variant="ghost" size="icon" className="h-9 w-9 text-[#787486] dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help Support</span>
        </Button>

        {/* Notification Icon with Dot */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-[#787486] dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#D8727D]" />
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

        {/* Profile Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="flex items-center gap-2.5 h-auto p-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-all select-none">
              <div className="hidden md:flex flex-col items-end text-xs">
                <span className="font-medium text-[#0D062D] dark:text-zinc-50 leading-tight">Anima Agrawal</span>
                <span className="text-[10px] text-[#787486] dark:text-zinc-500 mt-0.5 font-normal">U.P, India</span>
              </div>
              <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Anima Agrawal" />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-semibold">AA</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3.5 w-3.5 text-[#292D32] dark:text-zinc-400" />
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-900" />
              <DropdownMenuItem className="cursor-pointer text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">Support</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-900" />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer text-xs transition-colors">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
