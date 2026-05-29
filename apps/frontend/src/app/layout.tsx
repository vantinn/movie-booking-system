import './globals.css'
import ReduxProvider from '@/providers/ReduxProvider'
import MainLayout from '@/components/layout/MainLayout'
import AppInitializer from '@/AppInitializer'


interface RootLayoutProps {
  children: React.ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body className="min-h-screen font-sans bg-white text-black">
        <ReduxProvider>
          <AppInitializer>
            <div className="min-h-screen flex flex-col">
              <MainLayout>
                {children}
              </MainLayout>
            </div>
          </AppInitializer>
        </ReduxProvider>
      </body>
    </html>
  )
}


