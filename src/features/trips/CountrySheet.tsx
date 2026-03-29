import { useState, useMemo, useRef } from "react";
import { Sheet } from "framework7-react";
import "./CountrySheet.css";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Bolivia","Bosnia",
  "Brazil","Bulgaria","Cambodia","Cameroon","Canada","Chile","China","Colombia","Croatia",
  "Cuba","Cyprus","Czech Republic","Denmark","Ecuador","Egypt","Estonia","Ethiopia",
  "Finland","France","Georgia","Germany","Ghana","Greece","Guatemala","Honduras",
  "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Latvia",
  "Lebanon","Libya","Lithuania","Luxembourg","Malaysia","Malta","Mexico","Moldova",
  "Mongolia","Montenegro","Morocco","Myanmar","Nepal","Netherlands","New Zealand",
  "Nicaragua","Nigeria","North Korea","Norway","Oman","Pakistan","Palestine","Panama",
  "Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia",
  "Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia","Somalia",
  "South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland",
  "Syria","Taiwan","Tajikistan","Thailand","Tunisia","Turkey","Turkmenistan",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
].sort();

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

interface Props {
  opened: boolean;
  onClose: () => void;
  onSelect: (country: string) => void;
}

const CountrySheet: React.FC<Props> = ({ opened, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() =>
    query
      ? COUNTRIES.filter(c => c.toLowerCase().includes(query.toLowerCase()))
      : COUNTRIES,
    [query]
  );

  const grouped = useMemo(() => {
    const map: Record<string, string[]> = {};
    filtered.forEach(c => {
      const letter = c[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(c);
    });
    return map;
  }, [filtered]);

  const handleLetterTap = (letter: string) => {
    const el = listRef.current?.querySelector(`[data-letter="${letter}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  const handleClose = () => {
    setQuery("");
    setSelected(null);
    onClose();
  };

  return (
    <Sheet
      className="country-sheet"
      opened={opened}
      onSheetClosed={handleClose}
      swipeToClose={false}
      backdrop
    >
      <div className="cs-inner">
        {/* Header */}
        <div className="cs-handle" />
        <div className="cs-header">
          <button className="cs-header-btn cs-close" onClick={handleClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#3C3C43" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <span className="cs-title">Country</span>
          <button
            className={`cs-header-btn cs-confirm ${selected ? "cs-confirm--active" : ""}`}
            onClick={handleConfirm}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M1 6l5 5L15 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="cs-search-wrap">
          <div className="cs-search">
            <svg className="cs-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="#8E8E93" strokeWidth="1.5"/>
              <path d="M11 11l3.5 3.5" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className="cs-search-input"
              type="text"
              placeholder="Search"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List + A-Z index */}
        <div className="cs-body">
          <div className="cs-list" ref={listRef}>
            {Object.entries(grouped).map(([letter, countries]) => (
              <div key={letter}>
                <div className="cs-section-header" data-letter={letter}>{letter}</div>
                {countries.map(country => (
                  <div key={country} className="cs-item" onClick={() => setSelected(country)}>
                    <span className="cs-item-name">{country}</span>
                    {selected === country && (
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                        <path d="M1 5.5l4 4L13 1" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    <div className="cs-item-divider" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* A-Z sidebar */}
          <div className="cs-az-index">
            {ALPHABET.map(letter => (
              <span
                key={letter}
                className="cs-az-letter"
                onClick={() => handleLetterTap(letter)}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
};

export default CountrySheet;
