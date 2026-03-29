import { useEffect, useRef, useState } from "react";
import { Sheet, f7 } from "framework7-react";
import "./DateSheet.css";

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

const formatDate = (d: Date) => {
  const day = d.getDate();
  const month = MONTHS[d.getMonth()].slice(0, 3);
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: (begin: string, end: string) => void;
}

const DateSheet: React.FC<Props> = ({ opened, onClose, onConfirm }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<any>(null);
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    if (!opened || !containerRef.current) return;

    // Destroy any leftover instance and clear the container
    setDates([]);
    calendarRef.current?.destroy();
    calendarRef.current = null;
    containerRef.current.innerHTML = "";

    calendarRef.current = f7.calendar.create({
      containerEl: containerRef.current,
      inline: true,
      rangePicker: true,
      rangePickerMinDays: 1,
      value: [],
      on: {
        change(_cal: any, value: Date[]) {
          setDates([...value]);
        },
      },
    });

    return () => {
      calendarRef.current?.destroy();
      calendarRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const begin = dates[0] ?? null;
  const end   = dates[1] ?? null;

  const handleConfirm = () => {
    if (!begin) return;
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    onConfirm(fmt(begin), end ? fmt(end) : fmt(begin));
    onClose();
  };

  return (
    <Sheet
      className="date-sheet"
      opened={opened}
      onSheetClosed={onClose}
      swipeToClose
      backdrop
    >
      <div className="ds-inner">
        <div className="ds-handle" />
        <h2 className="ds-title">Set Dates</h2>

        {/* Date pills */}
        <div className="ds-pills-row">
          <div className={`ds-pill ${begin ? "ds-pill--set" : ""}`}>
            <span>{begin ? formatDate(begin) : "Begin Date"}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8H14M14 8L9.5 3.5M14 8L9.5 12.5"
              stroke="#86999E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className={`ds-pill ${end ? "ds-pill--set" : ""}`}>
            <span>{end ? formatDate(end) : "End Date"}</span>
          </div>
        </div>

        {/* F7 calendar mounts here */}
        <div className="ds-calendar-wrap" ref={containerRef} />

        <div className="ds-footer">
          <button className="ds-continue" onClick={handleConfirm} disabled={!begin}>
            CONTINUE
          </button>
        </div>
      </div>
    </Sheet>
  );
};

export default DateSheet;
