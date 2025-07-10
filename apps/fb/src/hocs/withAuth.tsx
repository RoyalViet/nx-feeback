import { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Loading from '@/components/common/Loading';
import { ROUTER_PATHS } from '@/routers/router.constant';

interface WithAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  loadingComponent?: ComponentType;
}

export const withAuth = <P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const {
    requireAuth = true,
    redirectTo = ROUTER_PATHS.SIGN_IN,
    loadingComponent: LoadingComponent,
  } = options;

  const AuthenticatedComponent = (props: P) => {
    // const { token } = useAuth();
    const token = '__fake_token__'; // Replace with actual auth hook or context
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        const hasValidToken = !!token;

        if (requireAuth && !hasValidToken) {
          setIsAuthorized(false);
          router.replace(redirectTo);
        } else if (!requireAuth && hasValidToken) {
          setIsAuthorized(false);
          router.replace(ROUTER_PATHS.ACCOUNT.ROOT);
        } else {
          setIsAuthorized(true);
        }
        setIsLoading(false);
      };

      const timer = setTimeout(checkAuth, 100);
      return () => clearTimeout(timer);
    }, [token, router]);

    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : <Loading />;
    }

    if (!isAuthorized) {
      return null;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

interface ClientRouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ClientRouteGuard: React.FC<ClientRouteGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = ROUTER_PATHS.SIGN_IN,
}) => {
  // const { token } = useAuth();
  const token = '__fake_token__'; // Replace with actual auth hook or context
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const hasValidToken = !!token;

    if (requireAuth && !hasValidToken) {
      setIsAuthorized(false);
      router.replace(redirectTo);
    } else if (!requireAuth && hasValidToken) {
      setIsAuthorized(false);
      router.replace(ROUTER_PATHS.ACCOUNT.DASHBOARD);
    } else {
      setIsAuthorized(true);
    }
  }, [token, requireAuth, redirectTo, router]);

  if (isAuthorized === null) {
    return <Loading />;
  }

  return isAuthorized ? <>{children}</> : null;
};
