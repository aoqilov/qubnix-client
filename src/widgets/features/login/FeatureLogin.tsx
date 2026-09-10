import { CusButton } from "@/components/ui/buttons/CusButton";
import { useSessionStore } from "@/store/session.store";

const MOCK_USER = {
  id: "mock-akiylov",
  fullName: "@akiylov",
  role: "Admin",
  phone: "97 723 60 24",
};

export default function FeatureLogin() {
  const setSession = useSessionStore((s) => s.setSession);

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <div className="w-full max-w-sm bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 font-condensed text-2xl tracking-wide text-vio">
          qubnix
        </h1>
        <p className="mb-6 text-sm text-neutral-500">
          Test rejimi — haqiqiy Telegram login hali ulanmagan
        </p>
        <CusButton
          colorPalette="purple"
          size="lg"
          onClick={() => setSession("mock-web-token", MOCK_USER)}
        >
          Kirish (test)
        </CusButton>
      </div>
    </div>
  );
}
