import { useState } from "react";
import { Sheet } from "framework7-react";
import Globe from "../home/components/Globe/Globe";
import "./NewTripSheet.css";

interface Props {
  opened: boolean;
  onClose: () => void;
}

const NewTripSheet: React.FC<Props> = ({ opened, onClose }) => {
  const [tripName, setTripName] = useState("");
  const [beginDate, setBeginDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const days =
    beginDate && endDate
      ? Math.max(0, Math.round(
          (new Date(endDate).getTime() - new Date(beginDate).getTime()) / 86_400_000
        ))
      : 0;

  return (
    <Sheet
      className="new-trip-sheet"
      opened={opened}
      onSheetClosed={onClose}
      swipeToClose
      backdrop
      push
    >
      <div className="nts-inner">
        <div className="nts-handle" />
        <h2 className="nts-title">New Trip</h2>

        <div className="nts-globe">
          <Globe />
        </div>

        <input
          className="nts-name-input"
          type="text"
          placeholder="Trip Name"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />

        <button className="nts-add-country">
          <span>📍</span>
          <span>ADD COUNTRY</span>
        </button>

        <div className="nts-date-row">
          <button
            className="nts-date-pill"
            onClick={() => { const d = prompt("Begin date (YYYY-MM-DD)"); if (d) setBeginDate(d); }}
          >
            {beginDate || "Begin Date"}
          </button>
          <span className="nts-date-arrow">→</span>
          <button
            className="nts-date-pill"
            onClick={() => { const d = prompt("End date (YYYY-MM-DD)"); if (d) setEndDate(d); }}
          >
            {endDate || "End Date"}
          </button>
        </div>

        <p className="nts-days">{days} DAYS</p>

        <div className="nts-save-wrapper">
          <button className="nts-save">SAVE</button>
        </div>
      </div>
    </Sheet>
  );
};

export default NewTripSheet;
