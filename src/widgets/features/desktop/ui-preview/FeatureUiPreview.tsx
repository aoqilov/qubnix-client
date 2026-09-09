import { useState, type PropsWithChildren } from "react";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusBreadCrumb } from "@/components/ui/bread-crumb/CusBreadCrumb";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusCheckbox, CusCheckboxGroup } from "@/components/ui/inputs/CusCheckbox";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusCalendarMultiple } from "@/components/ui/calendar/CusCalendarMultiple";
import { CusTimepicker } from "@/components/ui/calendar/CusTimepicker";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusDialogDelete } from "@/components/ui/dialog/CusDialogDelete";
import CusDialogDeleteChild from "@/components/ui/dialog/childs/CusDialogDelete";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { CusPopover } from "@/components/ui/popover/CusPopover";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { CusToasterFull, useToasterFull } from "@/components/ui/toaster/CusToasterFull";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#e6e6e8"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#8a8d90" text-anchor="middle" dominant-baseline="middle">300x200</text></svg>`,
  );

interface DemoRow {
  id: number;
  name: string;
  status: string;
}

const DEMO_ROWS: DemoRow[] = [
  { id: 1, name: "Alisher Qodirov", status: "Faol" },
  { id: 2, name: "Dilnoza Rashidova", status: "Ta'tilda" },
  { id: 3, name: "Bekzod Yusupov", status: "Ishdan bo'shatilgan" },
];

const TABLE_COLUMNS: ColumnDef<DemoRow>[] = [
  { key: "name", header: "Ism", sortable: true },
  { key: "status", header: "Holat" },
];

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="border-b border-neutral-200 pb-8">
      <h2 className="mb-4 font-condensed text-sm uppercase tracking-wide text-neutral-500">
        {title}
      </h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

export default function FeatureUiPreview() {
  const [checked, setChecked] = useState(false);
  const [checkedGroup, setCheckedGroup] = useState<string[]>(["thrill"]);
  const [switchOn, setSwitchOn] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [segment, setSegment] = useState("list");
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteChildOpen, setDeleteChildOpen] = useState(false);

  const toaster = useToasterFull();

  return (
    <div className="space-y-8 pb-16">
      <h1 className="font-condensed text-lg tracking-wide">UI Kit Preview</h1>

      <Section title="Button">
        <CusButton>Solid</CusButton>
        <CusButton variant="outline">Outline</CusButton>
        <CusButton variant="subtle">Subtle</CusButton>
        <CusButton variant="ghost">Ghost</CusButton>
        <CusButton colorPalette="red">Delete</CusButton>
        <CusButton isLoading loadingText="Saqlanmoqda...">
          Loading
        </CusButton>
        <CusButton isDisabled>Disabled</CusButton>
      </Section>

      <Section title="Badge">
        <CusBadge status="active" />
        <CusBadge status="inactive" />
        <CusBadge status="vacation" />
        <CusBadge status="pending" />
        <CusBadge role="SUPER_ADMIN" />
        <CusBadge role="CASHIER" />
        <CusBadge colorPalette="purple">Custom</CusBadge>
      </Section>

      <Section title="BreadCrumb">
        <CusBreadCrumb
          items={[
            { label: "Bosh sahifa", to: "/" },
            { label: "Xodimlar", to: "/employees" },
            { label: "Alisher Qodirov" },
          ]}
        />
      </Section>

      <Section title="Input / TextArea">
        <div className="w-64">
          <CusInput label="Ism" placeholder="Ismingizni kiriting" clearable />
        </div>
        <div className="w-64">
          <CusInput label="Email" isRequired errorText="Email noto'g'ri formatda" />
        </div>
        <div className="w-64">
          <CusTextArea label="Izoh" placeholder="Matn kiriting..." />
        </div>
      </Section>

      <Section title="Checkbox / Switch">
        <CusCheckbox
          label="Shartlarga roziman"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <CusCheckboxGroup value={checkedGroup} onChange={setCheckedGroup} label="Kategoriyalar">
          <CusCheckbox label="Ekstremal" value="thrill" />
          <CusCheckbox label="Oilaviy" value="family" />
        </CusCheckboxGroup>
        <CusSwitch
          label="Push xabarnomalar"
          checked={switchOn}
          onCheckedChange={setSwitchOn}
        />
      </Section>

      <Section title="Select">
        <div className="w-56">
          <CusSelect
            options={[
              { label: "Superadmin", value: "superadmin" },
              { label: "Kassir", value: "cashier" },
              { label: "Operator", value: "operator" },
            ]}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="Rol tanlang"
            clearable
          />
        </div>
        <div className="w-56">
          <CusSelect<string>
            multiple
            options={[
              { label: "React", value: "react" },
              { label: "Vue", value: "vue" },
              { label: "Svelte", value: "svelte" },
            ]}
            value={multiSelectValue}
            onChange={setMultiSelectValue}
            placeholder="Bir nechtasini tanlang"
          />
        </div>
      </Section>

      <Section title="FileUpload">
        <div className="w-64">
          <CusFileUpload label="Rasm" />
        </div>
        <div className="w-72">
          <CusFileUpload label="Fayllar" variant="dropzone" maxFiles={5} />
        </div>
      </Section>

      <Section title="Calendar / Timepicker">
        <div className="w-56">
          <CusCalendar label="Sana" />
        </div>
        <div className="w-72">
          <CusCalendarMultiple label="Davr" />
        </div>
        <div className="w-40">
          <CusTimepicker label="Vaqt" value={time} onChange={setTime} />
        </div>
      </Section>

      <Section title="Segment">
        <div className="w-72">
          <CusSegment
            value={segment}
            onValueChange={setSegment}
            items={[
              { id: "list", label: "Ro'yxat" },
              { id: "chart", label: "Statistika" },
            ]}
          />
        </div>
      </Section>

      <Section title="ImagePreview">
        <CusImagePreview src={PLACEHOLDER_IMAGE} width={150} height={100} borderRadius={10} />
      </Section>

      <Section title="Popover">
        <CusPopover trigger={<CusButton variant="outline">Popover ochish</CusButton>}>
          <div className="p-4 text-sm">Popover kontenti shu yerda.</div>
        </CusPopover>
      </Section>

      <Section title="Dialog / Drawer / DialogDelete">
        <CusButton onClick={() => setDialogOpen(true)}>Dialog ochish</CusButton>
        <CusDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Xodimni tahrirlash"
          description="Ma'lumotlarni yangilang."
          footer={
            <>
              <CusButton variant="outline" onClick={() => setDialogOpen(false)}>
                Bekor qilish
              </CusButton>
              <CusButton onClick={() => setDialogOpen(false)}>Saqlash</CusButton>
            </>
          }
        >
          <CusInput label="Ism" placeholder="Ism" />
        </CusDialog>

        <CusButton onClick={() => setDrawerOpen(true)}>Drawer ochish</CusButton>
        <CusDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Filter"
          description="Kerakli filtrlarni tanlang."
        >
          <p className="text-sm text-neutral-500">Drawer kontenti shu yerda.</p>
        </CusDrawer>

        <CusButton colorPalette="red" onClick={() => setDeleteOpen(true)}>
          O'chirish (v1)
        </CusButton>
        <CusDialogDelete
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => setDeleteOpen(false)}
        />

        <CusButton colorPalette="red" onClick={() => setDeleteChildOpen(true)}>
          O'chirish (v2)
        </CusButton>
        <CusDialogDeleteChild
          open={deleteChildOpen}
          onClose={() => setDeleteChildOpen(false)}
          onConfirm={() => setDeleteChildOpen(false)}
        />
      </Section>

      <Section title="Toaster">
        <CusButton colorPalette="green" onClick={() => toaster.show("Muvaffaqiyatli saqlandi", "success")}>
          Success toast
        </CusButton>
        <CusButton colorPalette="red" onClick={() => toaster.show("Xatolik yuz berdi", "error")}>
          Error toast
        </CusButton>
        <CusToasterFull items={toaster.items} onRemove={toaster.remove} />
      </Section>

      <Section title="Table / Pagination">
        <div className="w-full">
          <CusTable data={DEMO_ROWS} columns={TABLE_COLUMNS} />
          <div className="mt-4">
            <CusPagination
              count={42}
              pageSize={10}
              page={page}
              onPageChange={setPage}
              showPageText
              showSizeSelect
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
