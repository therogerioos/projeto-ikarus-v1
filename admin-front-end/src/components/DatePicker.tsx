import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "../lib/utils";

interface DatePickerProps {
  valueISO: string | null;
  disabled?: boolean;
  className?: string;
  onChange?: (date: string) => void; // Retorna string no formato local: YYYY-MM-DDTHH:MM:SS.mmm
}

export function DatePicker({ valueISO, disabled = false, className, onChange }: DatePickerProps) {
  // Parse que aceita "YYYY-MM-DDTHH:MM:SS(.mmm)?" ou outros ISO
  const parseDate = (value?: string | null) => {
    if (!value) return undefined;
    const localIsoMatch = value.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?$/
    );
    if (localIsoMatch) {
      const [, y, mo, da, hh, mm, ss, ms] = localIsoMatch;
      // Se vier mais de 3 dígitos nos "ms", convertemos para milissegundos truncando os extras
      const msStr = (ms ?? "0").slice(0, 3).padEnd(3, "0");
      return new Date(
        Number(y),
        Number(mo) - 1,
        Number(da),
        Number(hh),
        Number(mm),
        Number(ss),
        Number(msStr)
      );
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const initialDate = parseDate(valueISO);

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(initialDate);
  const [hour, setHour] = React.useState<number>(initialDate?.getHours() ?? 0);
  const [minute, setMinute] = React.useState<number>(initialDate?.getMinutes() ?? 0);
  const [second, setSecond] = React.useState<number>(initialDate?.getSeconds() ?? 0);

  // Sincroniza quando valueISO prop muda
  React.useEffect(() => {
    const d = parseDate(valueISO);
    if (d) {
      setSelectedDate(d);
      setHour(d.getHours());
      setMinute(d.getMinutes());
      setSecond(d.getSeconds());
    } else {
      setSelectedDate(undefined);
      setHour(0);
      setMinute(0);
      setSecond(0);
    }
  }, [valueISO]);

  // monta string local ISO: YYYY-MM-DDTHH:MM:SS.mmm (sem Z)
  const formatLocalISO = (date: Date, hh: number, mm: number, ss: number, ms = 0) => {
    const Y = String(date.getFullYear()).padStart(4, "0");
    const M = String(date.getMonth() + 1).padStart(2, "0");
    const D = String(date.getDate()).padStart(2, "0");
    const H = String(hh).padStart(2, "0");
    const mStr = String(mm).padStart(2, "0");
    const sStr = String(ss).padStart(2, "0");
    const msStr = String(ms).padStart(3, "0"); // 3 dígitos
    return `${Y}-${M}-${D}T${H}:${mStr}:${sStr}.${msStr}`;
  };

  // Emite onChange sempre que date/hh/mm/ss mudarem — mas evita disparo no primeiro render
  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    // base: se não tiver selectedDate usamos a data atual
    const base = selectedDate ?? new Date();
    onChange?.(formatLocalISO(base, hour, minute, second, 0));
  }, [selectedDate, hour, minute, second, onChange]);

  const handleSelect = (d: Date | undefined) => {
    if (d) {
      setSelectedDate(d);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <input
          type="text"
          value={
            selectedDate
              ? `${selectedDate.toLocaleDateString()} ${String(hour).padStart(2, "0")}:${String(
                  minute
                ).padStart(2, "0")}:${String(second).padStart(2, "0")}`
              : ""
          }
          readOnly
          disabled={disabled}
          className={cn(
            "border px-3 py-2 rounded-md  cursor-pointer",
            disabled ? "cursor-not-allowed opacity-50" : "",
            className
          )}
        />
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent>
          <Calendar mode="single" required={false} selected={selectedDate} onSelect={handleSelect} />
          <div className="flex space-x-2 mt-2 bg-white justify-center items-center">
            <input
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => {
                const v = Number(e.target.value);
                setHour(Number.isNaN(v) ? 0 : Math.max(0, Math.min(23, v)));
              }}
              className="w-16 border rounded px-2"
              placeholder="HH"
            />
            <span>:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={minute}
              onChange={(e) => {
                const v = Number(e.target.value);
                setMinute(Number.isNaN(v) ? 0 : Math.max(0, Math.min(59, v)));
              }}
              className="w-16 border rounded px-2"
              placeholder="MM"
            />
            <span>:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={second}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSecond(Number.isNaN(v) ? 0 : Math.max(0, Math.min(59, v)));
              }}
              className="w-16 border rounded px-2"
              placeholder="SS"
            />
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
