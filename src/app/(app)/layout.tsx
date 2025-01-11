import {SideComponent} from "@/components/SideComponent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SideComponent />
        <main className="w-full m-2">
          <div className="flex items-center gap-2 border-sidebar bg-sidebar border shadow rounded-md p-2 px-4">
            <div className="ml-auto"></div>
              <UserButton />
            </div>
            <div className="h-4"></div>
            <div className="border-sidebar-border bg-sidebar border shadow rounded-md h-[calc(100vh-6rem)] p-4">
                {children}
            </div>
        </main>
    </SidebarProvider>
  );
}
