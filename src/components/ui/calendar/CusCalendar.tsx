import { useState } from "react";
import { DatePicker, Field } from "@chakra-ui/react";
import type { DateValue, DatePickerDateView } from "@ark-ui/react/date-picker";
import { parseDate } from "@internationalized/date";
import { LuCalendar } from "react-icons/lu";

const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectionMode = "single" | "multiple" | "range";
type ColorPalette  =
  | "blue" | "green" | "red" | "orange" | "purple"
  | "yellow" | "cyan" | "teal" | "pink" | "gray";

function formatDay(v: DateValue): string {
  return `${String(v.day).padStart(2, "0")}.${String(v.month).padStart(2, "0")}.${v.year}`;
}

export interface CusCalendarProps {
  // Input appearance
  label?:       string;
  placeholder?: string;
  errorText?:   string;
  isRequired?:  boolean;

  // Accent color
  colorPalette?: ColorPalette;

  // Value control
  value?:          DateValue[];
  defaultValue?:   DateValue[];
  onValueChange?:  (details: { value: DateValue[]; valueAsString: string[] }) => void;

  // Selection / date restrictions
  selectionMode?:     SelectionMode;
  min?:               DateValue;
  max?:               DateValue;
  isDateUnavailable?: (date: DateValue, locale: string) => boolean;

  // View granularity — set both to "month" for a month-name (no day) picker
  defaultView?: DatePickerDateView;
  minView?:     DatePickerDateView;
  maxView?:     DatePickerDateView;

  // Localisation
  locale?:   string;
  timeZone?: string;

  // State
  disabled?: boolean;
  readOnly?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CusCalendar({
  label,
  placeholder,
  errorText,
  isRequired,
  colorPalette = "blue",
  value,
  defaultValue,
  onValueChange,
  selectionMode = "single",
  min,
  max,
  isDateUnavailable,
  defaultView,
  minView = "day",
  maxView = "year",
  locale = "ru-RU",
  timeZone,
  disabled,
  readOnly,
}: CusCalendarProps) {
  const isMonthPicker = minView === "month";
  const resolvedPlaceholder =
    placeholder ?? (isMonthPicker ? "Месяц ГГГГ" : "ДД.ММ.ГГГГ");
  function formatMonth(v: DateValue): string {
    return `${MONTHS_NOMINATIVE[v.month - 1]} ${v.year}`;
  }
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const hasError = !!errorText;
  const borderColor = hasError
    ? "#ef4444"
    : focused
    ? "#3b82f6"
    : "var(--border-default)";
  const boxShadow = hasError
    ? "0 0 0 1px #ef4444"
    : focused
    ? "0 0 0 1px #3b82f6"
    : "none";

  return (
    <Field.Root invalid={hasError} required={isRequired} width="100%">
      {label && (
        <Field.Label fontSize="sm" fontWeight="medium" mb="1" color="var(--text-3)">
          {label}
          <Field.RequiredIndicator color="#ef4444" ml="0.5" />
        </Field.Label>
      )}

      <DatePicker.Root
        width="100%"
        open={open}
        onOpenChange={({ open: o }) => setOpen(o)}
        selectionMode={selectionMode}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        min={min}
        max={max}
        isDateUnavailable={isDateUnavailable}
        defaultView={defaultView ?? minView}
        minView={minView}
        maxView={maxView}
        locale={locale}
        timeZone={timeZone}
        disabled={disabled}
        readOnly={readOnly || isMonthPicker}
        colorPalette={colorPalette}
        closeOnSelect
        format={isMonthPicker ? formatMonth : formatDay}
        parse={(v) => {
          const [d, m, y] = v.split(".");
          if (!d || !m || y?.length !== 4) return undefined;
          try {
            return parseDate(
              `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
            );
          } catch {
            return undefined;
          }
        }}
      >
        <DatePicker.Control style={{ position: "relative", width: "100%" }}>
          <DatePicker.Input
            placeholder={resolvedPlaceholder}
            onClick={() => { if (!open) setOpen(true); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              height: 40,
              paddingLeft: 12,
              paddingRight: 40,
              background: "var(--bg-input)",
              border: `1px solid ${borderColor}`,
              borderRadius: 8,
              color: "var(--text-default)",
              fontSize: 14,
              outline: "none",
              boxShadow,
              transition: "border-color 0.15s, box-shadow 0.15s",
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "not-allowed" : "text",
            }}
          />
          <DatePicker.Trigger
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: disabled ? "not-allowed" : "pointer",
              color: "var(--text-muted)",
              padding: 4,
              borderRadius: 4,
            }}
          >
            <LuCalendar size={15} />
          </DatePicker.Trigger>
        </DatePicker.Control>

        <DatePicker.Positioner>
          <DatePicker.Content
            style={{
              background: "var(--bg-second)",
              border: "1px solid var(--border-default)",
              borderRadius: 12,
              padding: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker.Root>

      {errorText && (
        <Field.ErrorText fontSize="xs" color="#ef4444" mt="1">
          {errorText}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
}
