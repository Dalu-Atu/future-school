import PropTypes from "prop-types"; // Import PropTypes for prop validation
import styled from "styled-components";
import ProgressBar from "./ProgressBar";
import { HiMiniUserGroup } from "react-icons/hi2";
import { HiMiniChartBar } from "react-icons/hi2";

const StyledAnalyticBox = styled.div`
  height: 11rem;
  border-radius: 8px;
  background-color: var(--color-white);
`;

function AnalyticsBox({ name, totalNo, colour }) {
  return (
    <StyledAnalyticBox>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            border: "1px solid white",
            backgroundColor: `${colour}`,
            margin: "0.7rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HiMiniUserGroup style={{ fontSize: "27px", color: "white" }} />
        </div>
        <div style={{ position: "relative", top: "1.5rem", right: "0.5rem" }}>
          <p style={{ fontWeight: "600", color: "gray" }}>{name}</p>
          <p>{totalNo}</p>
        </div>
      </div>
      <div style={{ margin: "1rem" }}>
        <ProgressBar actcolour={colour} symbol={``} />
      </div>
      <div
        style={{
          position: "relative",
          bottom: "5px",
          left: "10px",
          colour,
          display: "flex",
        }}
      >
        <HiMiniChartBar
          style={{ color: `${colour}`, position: "relative", top: "-0.4rem" }}
        />
        <span
          style={{
            fontSize: "12px",
            color: "gray",
            position: "relative",
            top: "-0.4em",
            left: "0.3rem",
          }}
        >
          + 21.2%
        </span>
      </div>
    </StyledAnalyticBox>
  );
}

// Add prop validation
AnalyticsBox.propTypes = {
  name: PropTypes.string.isRequired,
  totalNo: PropTypes.number.isRequired,
  colour: PropTypes.string.isRequired,
};

export default AnalyticsBox;
