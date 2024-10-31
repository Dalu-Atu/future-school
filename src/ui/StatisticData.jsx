import styled from 'styled-components';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import '../styles/calender.css';
import { useTheme } from '../services/ThemeContext'; // Adjust this import based on your actual theme context

const StyledStatisticsData = styled.div`
  text-align: center;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 742px) {
    display: none;
    visibility: hidden;
  }
`;

const StyledCalendarContainer = styled.div`
  /* width: 400px; */
  max-width: 100%;
  background-color: var(
    --color-white
  ); /* Example: Change to your desired background color */
  color: var(--color-gray); /* Example: Default color for weekdays */
  border-radius: 8px;
  font-family: Arial, Helvetica, sans-serif;
  padding-left: 0.4rem;
  padding-right: 0.4rem;

  .react-calendar__month-view__weekdays {
    color: ${(props) => props.$colorprimary};
    text-align: center;
    text-transform: uppercase;
    font: inherit;
    font-size: 0.75em;
    font-weight: bold;
    border-bottom: none; /* Remove underline from days of the week */
  }

  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
    font-size: 16px;
    margin-top: 8px;
    font-weight: bold;
    white-space: nowrap;
    border: none; /* Remove border from navigation buttons */
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: transparent;
  }

  .react-calendar__navigation button[disabled] {
    background-color: transparent;
  }
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  background-color: var(
    --color-white
  ); /* Example: Change to your desired background color */

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: ${(props) =>
      props.$colorprimary}; /* Use primary color for hover/focus on active day */
  }

  .react-calendar__month-view__days__day--weekend {
    color: inherit;
  }

  .react-calendar__month-view__days__day--neighboringMonth,
  .react-calendar__month-view__days__day--neighboringMonth:enabled:hover,
  .react-calendar__month-view__days__day--neighboringMonth:enabled:focus,
  .react-calendar__month-view__days__day--neighboringMonth:disabled {
    visibility: hidden; /* Hide neighboring month days completely */
    pointer-events: none; /* Prevent interaction with neighboring month days */
  }
`;

const SelectedDate = styled.p`
  text-align: center;
  margin-top: 8px;
  font-weight: bold;
`;

function StatisticData() {
  const [date, setDate] = useState(new Date());
  const { primaryColor } = useTheme(); // Assuming useTheme() provides primaryColor

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <StyledStatisticsData>
      <StyledCalendarContainer $colorprimary={primaryColor}>
        <StyledCalendar
          onChange={onChange}
          value={date}
          $colorprimary={primaryColor} // Pass primaryColor to StyledCalendar
        />
      </StyledCalendarContainer>
      <SelectedDate>
        <span className="bold">Selected Date:</span> {date.toDateString()}
      </SelectedDate>
    </StyledStatisticsData>
  );
}

export default StatisticData;
