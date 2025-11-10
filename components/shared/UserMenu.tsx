"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";

type UserMenuProps = {
  imageUrl?: string | null;
  onLogout?: () => void; // optional override
};

function initials(text?: string | null) {
  if (!text) return "U";
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function UserMenu({ imageUrl, onLogout }: UserMenuProps) {
  const router = useRouter();
  const { username, role, logout } = useAuthStore();

  const name = username ?? "User";
  const roleText = role ?? "member";
  const fallback = initials(username);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      router.replace("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mr-3">
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-2 cursor-pointer"
          aria-label="Open user menu"
        >
          <Avatar className="h-10 w-10 bg-green-500 border-3 border-green-600">
            <AvatarImage src={imageUrl ?? undefined} alt={name} />
            <AvatarFallback className="font-bold text-green-700 text-lg">{fallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 z-1000 mr-3"
      >
        <DropdownMenuLabel className="flex flex-col lg:flex-row items-center justify-between gap-1">
          <span className="text-lg font-semibold leading-none">{name}</span>
          <Badge variant="secondary" className="w-fit text-xs text-black bg-green-200">
            {roleText}
          </Badge>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
