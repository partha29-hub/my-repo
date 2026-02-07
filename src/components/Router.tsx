import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import NEODetailPage from '@/components/pages/NEODetailPage';
import WatchlistPage from '@/components/pages/WatchlistPage';
import CommunityPage from '@/components/pages/CommunityPage';
import ProfilePage from '@/components/pages/ProfilePage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
        routeMetadata: {
          pageIdentifier: 'dashboard',
        },
      },
      {
        path: "neo/:id",
        element: <NEODetailPage />,
        routeMetadata: {
          pageIdentifier: 'neo-detail',
        },
      },
      {
        path: "watchlist",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your watchlist">
            <WatchlistPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'watchlist',
        },
      },
      {
        path: "community",
        element: <CommunityPage />,
        routeMetadata: {
          pageIdentifier: 'community',
        },
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your profile">
            <ProfilePage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'profile',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
