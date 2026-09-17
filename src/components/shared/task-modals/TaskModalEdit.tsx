import { useEffect, useState } from "react";
import { Drawer } from "@chakra-ui/react";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";

export interface TaskModalEditValues {
  title: string;
  description: string;
}

interface TaskModalEditProps {
  open: boolean;
  onClose: () => void;
  initialValues: TaskModalEditValues;
  onSubmit: (values: TaskModalEditValues) => void;
}

function TaskModalEdit({
  open,
  onClose,
  initialValues,
  onSubmit,
}: TaskModalEditProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);

  // CusDrawer unmountOnExit bo'lsa ham, TaskModalEditning o'zi parentda doim
  // mount holatda qoladi — shuning uchun har safar ochilganda maydonlarni
  // yangi task qiymatlariga qayta sinxronlaymiz.
  useEffect(() => {
    if (open) {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
    }
  }, [open, initialValues]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
    onClose();
  };

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title="Vazifani tahrirlash"
      footer={
        <>
          <Drawer.ActionTrigger asChild>
            <CusButton variant="outline" className="flex-1">
              Bekor qilish
            </CusButton>
          </Drawer.ActionTrigger>
          <CusButton
            className="flex-1"
            onClick={handleSubmit}
            style={{
              background: "var(--brand-default)",
              color: "var(--text-on-brand)",
            }}
          >
            Saqlash
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <CusInput
          label="Sarlavha"
          isRequired
          placeholder="Vazifa nomini kiriting"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <CusTextArea
          label="Tavsif"
          placeholder="Vazifa haqida qisqacha ma'lumot"
          autoresize
          maxH="10lh"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </CusDrawer>
  );
}

export default TaskModalEdit;
