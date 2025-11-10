import { MobileSidebar } from '@/components/layout/MobailSidebar';
import { Sidebar } from '@/components/layout/Sidebar';
import { UserMenu } from '@/components/shared/UserMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-1'>
        <header className='sticky top-0 z-100 bg-background/80 backdrop-blur border-b py-2'>
          <div className='flex h-14 items-center gap-2 px-3'>
            <MobileSidebar />
            <div className='ml-auto'>
              <UserMenu />
            </div>
          </div>
        </header>

        <main className='p-5 bg-white'>{children}</main>
      </div>
    </div>
  );
}
