import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";

export default function FeatureSettings() {
  return (
    <>
      <CusPageTitle title="Settings" description="Manage your settings" />
      <h1 className="font-condensed text-lg tracking-wide">Settings1</h1>
      <div className="grid grid-cols-2 gap-4">
        <CusCardbox>
          <h1>ee</h1>
          <p>ewr</p>
        </CusCardbox>{" "}
        <CusCardbox>
          <h1>ee</h1>
          <p>ewr</p>
        </CusCardbox>
      </div>
      <CusCardbox>
        <h1>ee</h1>
        <p>ewr</p>
      </CusCardbox>
    </>
  );
}
