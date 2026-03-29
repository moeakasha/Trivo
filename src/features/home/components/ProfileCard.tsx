interface Props { avatar: string; }

const ProfileCard: React.FC<Props> = ({ avatar }) => (
  <div className="profile-section">
    <div className="avatar-wrapper">
      <img src={avatar} alt="Profile" />
    </div>
    <button className="filter-pill" aria-label="Filter trips">
      <span>All Trips</span>
      <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
        <path d="M1 1l5 5 5-5" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
);

export default ProfileCard;
