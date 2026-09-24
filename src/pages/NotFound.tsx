import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="font-condensed text-2xl tracking-wide">404</h1>
      <p className="text-sm text-[var(--text-muted)]">{t("common.states.notFound")}</p>
    </div>
  );
}
