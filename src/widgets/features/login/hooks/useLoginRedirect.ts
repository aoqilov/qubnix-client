import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FALLBACK_REDIRECT = "/doska";

/**
 * Gate /login ga yuborganda qayerdan kelganini `state.from` da qoldiradi —
 * login muvaffaqiyatli bo'lgach o'sha sahifaga qaytaramiz.
 */
export function useLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return useCallback(() => {
    const target =
      from && !from.startsWith("/login") ? from : FALLBACK_REDIRECT;
    navigate(target, { replace: true });
  }, [from, navigate]);
}
