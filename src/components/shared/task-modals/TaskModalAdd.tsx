import { useState } from "react";
import { Drawer } from "@chakra-ui/react";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";

export interface TaskModalAddValues {
  title: string;
  description: string;
}

interface TaskModalAddProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskModalAddValues) => void;
}

function TaskModalAdd({ open, onClose, onSubmit }: TaskModalAddProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
      title="Yangi vazifa"
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
            Yaratish
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

export default TaskModalAdd;
