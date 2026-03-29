import { useState } from "react";
import { Page } from "framework7-react";
import ProfileCard from "./components/ProfileCard";
import Globe from "./components/Globe/Globe";
import StatsCard from "./components/StatsCard";
import NewTripButton from "./components/NewTripButton";
import NewTripSheet from "../trips/NewTripSheet";
import "./HomePage.css";

const STATS = { trips: 0, countries: 0, cities: 0 };

const HomePage: React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Page>
      <div className="home-container">
        <ProfileCard avatar="/assets/profile.png" />
        <div className="globe-section">
          <Globe />
        </div>
        <StatsCard stats={STATS} />
        <NewTripButton onClick={() => setSheetOpen(true)} />
      </div>

      <NewTripSheet opened={sheetOpen} onClose={() => setSheetOpen(false)} />
    </Page>
  );
};

export default HomePage;
