import { StyledRangeButtons } from '../styles';

const TimeRangeButtons = ({ activeRange, setActiveRange }) => {
  return (
    <StyledRangeButtons>
      <li>
        <button
          className={activeRange === 'short' ? 'active' : ''}
          onClick={() => setActiveRange('short')}>
          This month
        </button>
      </li>
      <li>
        <button
          className={activeRange === 'medium' ? 'active' : ''}
          onClick={() => setActiveRange('medium')}>
          Last 6 months
        </button>
      </li>
      <li>
        <button
          className={activeRange === 'long' ? 'active' : ''}
          onClick={() => setActiveRange('long')}>
          All time
        </button>
      </li>
    </StyledRangeButtons>
  );
};

export default TimeRangeButtons;