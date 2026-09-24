import { parseDate } from "@internationalized/date";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { toDateKey } from "@/utils/weekDays";

interface DayPickerDialogProps {
  open: boolean;
  onClose: () => void;
  value: Date;
  onPick: (date: Date) => void;
}

export function DayPickerDialog({ open, onClose, value, onPick }: DayPickerDialogProps) {
  return (
    <CusDialog open={open} onClose={onClose} title="Выберите дату" centered size="sm">
      <CusCalendar
        inline
        value={[parseDate(toDateKey(value))]}
        onValueChange={({ value: picked }) => {
          const day = picked[0];
          if (day) onPick(new Date(day.year, day.month - 1, day.day));
        }}
      />
    </CusDialog>
  );
}
