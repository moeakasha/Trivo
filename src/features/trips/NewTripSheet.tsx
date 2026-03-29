import { useState } from "react";
import { Sheet } from "framework7-react";
import Globe from "../home/components/Globe/Globe";
import CountrySheet from "./CountrySheet";
import DateSheet from "./DateSheet";
import "./NewTripSheet.css";

interface Props {
  opened: boolean;
  onClose: () => void;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}.${MONTHS[d.getMonth()]}.${d.getFullYear()}`;
};

const NewTripSheet: React.FC<Props> = ({ opened, onClose }) => {
  const [tripName, setTripName] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const [countrySheetOpen, setCountrySheetOpen] = useState(false);
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [beginDate, setBeginDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const days =
    beginDate && endDate
      ? Math.max(0, Math.round(
          (new Date(endDate).getTime() - new Date(beginDate).getTime()) / 86_400_000
        ))
      : 0;

  return (
    <>
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
            {opened && <Globe spin={false} />}
          </div>

          <input
            className="nts-name-input"
            type="text"
            placeholder="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />

          <button className="nts-add-country" onClick={() => setCountrySheetOpen(true)}>
            <span>📍</span>
            <span>{country ? country.toUpperCase() : "ADD COUNTRY"}</span>
          </button>

          <div className="nts-date-row">
            <button className="nts-date-pill" onClick={() => setDateSheetOpen(true)}>
              {beginDate ? formatDate(beginDate) : "Begin Date"}
            </button>
            <span className="nts-date-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8H14M14 8L9.5 3.5M14 8L9.5 12.5"
                  stroke="#86999E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <button className="nts-date-pill" onClick={() => setDateSheetOpen(true)}>
              {endDate ? formatDate(endDate) : "End Date"}
            </button>
          </div>

          <p className="nts-days">{days} DAYS</p>

          <div className="nts-save-wrapper">
            <button className="nts-save">SAVE</button>
          </div>
        </div>
      </Sheet>

      <CountrySheet
        opened={countrySheetOpen}
        onClose={() => setCountrySheetOpen(false)}
        onSelect={(c) => setCountry(c)}
      />

      <DateSheet
        opened={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
        onConfirm={(begin, end) => { setBeginDate(begin); setEndDate(end); }}
      />
    </>
  );
};

export default NewTripSheet;
