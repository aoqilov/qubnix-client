import { useEffect, useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusCheckbox } from "@/components/ui/inputs/CusCheckbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { avatarColorVar } from "@/utils/avatarColor";

export interface MemberPickerItem {
  id: string;
  name: string;
}

interface MemberPickerDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  members: MemberPickerItem[];
  selectedIds: string[];
  onApply: (ids: string[]) => void;
}

export function MemberPickerDrawer({
  open,
  onClose,
  title = "Сотрудники",
  members,
  selectedIds,
  onApply,
}: MemberPickerDrawerProps) {
  // Tashqi (qo'llanilgan) tanlovdan mustaqil qoralama — "Отмена" bosilsa
  // o'zgarishlar tashlab yuboriladi, faqat "Применить" ularni chinakam saqlaydi.
  const [draftIds, setDraftIds] = useState(selectedIds);
  const [search, setSearch] = useState("");

  // Drawer har safar ochilganda qoralama hozirgi qo'llangan tanlovdan qayta boshlanadi.
  useEffect(() => {
    if (open) {
      setDraftIds(selectedIds);
      setSearch("");
    }
  }, [open, selectedIds]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? members.filter((member) => member.name.toLowerCase().includes(query)) : members;
  }, [members, search]);

  const handleCancel = () => {
    setDraftIds(selectedIds);
    onClose();
  };

  const handleApply = () => {
    onApply(draftIds);
    onClose();
  };

  const isAllSelected = draftIds.length === members.length;

  const toggleMember = (id: string) => {
    setDraftIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  return (
    <CusDrawer
      open={open}
      onClose={handleCancel}
      placement="end"
      size="full"
      title={title}
      footer={
        <div className="flex w-full gap-2">
          <CusButton variant="outline" className="flex-1" onClick={handleCancel}>
            Отмена
          </CusButton>
          <CusButton className="flex-1" onClick={handleApply}>
            Применить
          </CusButton>
        </div>
      }
    >
      <div className="mb-3">
        <CusInput
          placeholder="Поиск сотрудников"
          clearable
          leftElementWidth="2.25rem"
          leftElement={<LuSearch size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <CusButton
          variant="outline"
          size="sm"
          className="flex-1"
          isDisabled={isAllSelected}
          onClick={() => setDraftIds(members.map((member) => member.id))}
        >
          Выбрать всех
        </CusButton>
        <CusButton
          variant="outline"
          size="sm"
          className="flex-1"
          isDisabled={draftIds.length === 0}
          onClick={() => setDraftIds([])}
        >
          Очистить
        </CusButton>
      </div>

      <div className="flex flex-col">
        {filteredMembers.length === 0 && (
          <p className="py-6 text-center text-sm text-secondary">Hech kim topilmadi</p>
        )}
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => toggleMember(member.id)}
            className="flex w-full cursor-pointer items-center justify-between border-b border-subtle py-3 last:border-b-0 hover:bg-surface-secondary"
          >
            <span className="flex items-center gap-2">
              <span
                className="flex size-8 flex-none items-center justify-center rounded-avatar text-xs font-semibold text-on-brand"
                style={{ background: avatarColorVar(member.id) }}
              >
                {member.name.charAt(0).toUpperCase()}
              </span>
              {member.name}
            </span>
            <span onClick={(e) => e.stopPropagation()}>
              <CusCheckbox
                checked={draftIds.includes(member.id)}
                onChange={() => toggleMember(member.id)}
              />
            </span>
          </div>
        ))}
      </div>
    </CusDrawer>
  );
}
