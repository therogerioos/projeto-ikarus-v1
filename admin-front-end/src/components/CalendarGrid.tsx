import { useState } from "react";
import { CalendarDay } from "./CalendarDay";
import { DayStatusDialog } from "./DayStatusDialog";

interface DaySchedule {
  status: "escalado" | "folga" | "demitido" | "ferias" | "licenca" | null;
  horaEntrada?: string;
  horaSaida?: string;
  inicioPausa?: string;
  fimPausa?: string;
}

interface CalendarGridProps {
  month: number;
  year: number;
  userId: string;
}

export const CalendarGrid = ({ month, year }: CalendarGridProps) => {
  const [schedules, setSchedules] = useState<Record<string, DaySchedule>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  const handleSaveSchedule = (schedule: DaySchedule) => {
    if (selectedDay) {
      const key = `${year}-${month}-${selectedDay}`;
      setSchedules(prev => ({
        ...prev,
        [key]: schedule
      }));
    }
    setDialogOpen(false);
  };

  const getDaySchedule = (day: number): DaySchedule | undefined => {
    const key = `${year}-${month}-${day}`;
    return schedules[key];
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
        {/* Week days header */}
        <div className="grid grid-cols-7 bg-white border-b border-gray-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center  text-sm font-semibold text-secondary-foreground border-gray-200 border-r"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="aspect-square border-r border-b border-gray-200 bg-muted/30  " />
          ))}
          
          {days.map((day) => (
            <CalendarDay
              key={day}
              day={day}
              schedule={getDaySchedule(day)}
              onClick={() => handleDayClick(day)}
            />
          ))}
        </div>
      </div>

      {selectedDay && (
        <DayStatusDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          day={selectedDay}
          month={month}
          year={year}
          initialSchedule={getDaySchedule(selectedDay)}
          onSave={handleSaveSchedule}
        />
      )}
    </>
  );
};