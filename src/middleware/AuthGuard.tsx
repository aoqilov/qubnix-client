import { Navigate, useLocation } from "react-router-dom";
import { useSessionStore } from "@/store/session.store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const token = useSessionStore((s) => s.token);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
