import PropTypes from "prop-types";
import styled from "styled-components";
import AnalyticsBox from "./AnalyticsBox";
import { useTheme } from "../services/ThemeContext";

const StyledAnalytics = styled.div`
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1.5rem;
  align-items: center;
  overflow: hidden;
`;

function Analytics({ data }) {
  const { primaryColor, secondaryColor } = useTheme();

  return (
    <StyledAnalytics>
      <AnalyticsBox
        name={`Pri Students`}
        totalNo={
          data.students.primaryStudents.length + data.students.pcStudents.length
        }
        colour={primaryColor}
      />
      <AnalyticsBox
        name={`Sec Students`}
        totalNo={data.students.secondaryStudents.length}
        colour={"#0369a1"}
      />
      <AnalyticsBox
        name={`All Teachers`}
        totalNo={data.teachers.length}
        colour={"hsl(351, 83%, 61%)"}
      />
    </StyledAnalytics>
  );
}

Analytics.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Analytics;
