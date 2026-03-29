interface Props { onClick?: () => void; }

const NewTripButton: React.FC<Props> = ({ onClick }) => (
  <button className="new-trip-button" onClick={onClick} aria-label="Create new trip">
    <span className="new-trip-icon">+</span>
    <span>New Trip</span>
  </button>
);

export default NewTripButton;
