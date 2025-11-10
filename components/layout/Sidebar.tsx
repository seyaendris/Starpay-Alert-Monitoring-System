import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./SidebarNav";
import Image from "next/image";

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:sticky md:top-0 md:h-screen md:w-64 border-r bg-background dark:bg-neutral-800/80">
      <div className="flex justify-center items-center py-2">
        <Image
          src='/images/starpay.png'
          width={130}
          height={50}
          alt="Starpay logo"
          className=""
          />
      </div>
      <Separator className="bg-gray-50" />
      <div className="flex-1 overflow-auto pt-7">
        <SidebarNav />
      </div>
    </aside>
  );
}
