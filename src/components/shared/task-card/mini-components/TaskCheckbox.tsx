import { LuCheck } from "react-icons/lu";

interface TaskCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function TaskCheckbox({ checked, onChange }: TaskCheckboxProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      aria-pressed={checked}
      style={{
        display: "flex",
        width: 18,
        height: 18,
        flexShrink: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
        border: "1.5px solid var(--red-solid, #DC2626)",
        background: checked ? "var(--red-solid, #DC2626)" : "transparent",
      }}
    >
      {checked && <LuCheck size={13} color="#fff" strokeWidth={3} />}
    </button>
  );
}

export default TaskCheckbox;
