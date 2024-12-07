import styled from "styled-components";
import barcodePic from "../assets/barcode.avif";
import PropTypes from "prop-types";
import "../styles/wav.css";
import { useSettings } from "../services/settingContext";

const StyledViewIdCard = styled.div`
  @media print {
    .card-grid {
      page-break-after: always;
    }
    .print-scale {
      transform: scale(0.6);
      transform-origin: top left;
    }
  }
  margin-top: 1rem;
`;

const CardContainer = styled.div``;

const Card = styled.div`
  position: relative;
  border: 2px solid rgb(5, 0, 49);
  width: 60mm; /* Adjusted size to fit 9 cards on an A4 page */
  height: 90mm; /* Adjusted size to fit 9 cards on an A4 page */
  margin: 1rem;
`;

const CardHeader = styled.div`
  height: 1.8rem;
  position: relative;
`;

const ProfilePhoto = styled.div`
  height: 30mm;
  width: 30mm;
  border-radius: 50%;
  border: 3px solid rgb(5, 0, 49);
  margin: 0 auto;
  position: relative;
  top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const DetailsContainer = styled.div`
  width: 45mm;
  margin: 0 auto;
  position: relative;
  top: 1rem;
`;

const HeaderOne = styled.h4`
  color: rgb(5, 0, 49);
  margin-top: 0.5rem;
  text-align: center;
  font-size: 13px; /* Reduced font-size to fit smaller card */
`;

const Class = styled.p`
  padding-left: 5px;
  border-bottom: 2px solid rgb(172, 172, 1);
  width: 40mm;
  text-align: center;
  font-size: 14px; /* Adjusted font size */
  margin: 0 auto;
  position: relative;
`;

const Body = styled.div``;

const Label = styled.div`
  color: gray;
  display: grid;
  grid-template-columns: 40% 60%;
  align-items: center;

  margin: 1rem auto;
  border: 1px solid lightgray;
  padding-left: 0rem;
`;

const Paragraph = styled.span`
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: relative;
  left: 1rem;
`;

const Footer = styled.div`
  width: 59.5mm;
  height: 1.5rem;
  background-color: rgb(172, 172, 1);
  position: absolute;

  top: 175.5px;
  left: -27.7px;
  bottom: 0;
`;

const Header3 = styled.h3`
  font-weight: 700;
  font-size: 14px;
  position: relative;
  left: 3rem;
`;

const Span = styled.span`
  font-size: 17px;
  padding-right: 0.5rem;
`;

function ViewIdCard({ data, className, handleClick }) {
  const settings = useSettings();
  const { name, id, pin, serialNumber, birthDate } = data;

  return (
    <div style={{ backgroundColor: "white" }}>
      <StyledViewIdCard>
        <CardContainer>
          <Card onClick={handleClick} style={{ cursor: "pointer" }}>
            <CardHeader>
              <div className="custom-shape-divider-top-1715354906">
                <svg
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
                    className="shape-fill"
                  ></path>
                </svg>
              </div>
            </CardHeader>
            <ProfilePhoto>
              <div
                style={{
                  border: "1px solid rgb(8, 1, 70)",
                  height: "10rem",
                  width: "10rem",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
              >
                <img
                  style={{
                    height: "8rem",
                    borderRadius: "50%",
                    width: "9rem",
                  }}
                  src={settings.images.logo}
                  alt=""
                />
              </div>
            </ProfilePhoto>
            <DetailsContainer>
              <HeaderOne>{name}</HeaderOne>
              <Class>{className}</Class>
              <Body>
                <Label>
                  <Header3>ID NO</Header3>
                  <Paragraph>
                    <Span>:</Span>
                    <span> {id}</span>
                  </Paragraph>
                </Label>
                <Label>
                  <Header3>PIN</Header3>
                  <Paragraph>
                    <Span>:</Span>
                    {pin}
                  </Paragraph>
                </Label>
                <div>
                  {/* <p style={{ color: "lightgray", textAlign: "center" }}>
                    SERIAL NO
                  </p> */}
                  <p
                    style={{
                      color: "gray",
                      textAlign: "center",
                      fontSize: "small",
                    }}
                  >
                    {serialNumber}
                  </p>
                </div>
                {/* Uncomment this section if needed */}
                {/* <BarcodeContainer>
                  <Barcode>
                    <img
                      style={{
                        position: "relative",
                        top: "-5rem",
                        transform: "scale(0.6)",
                      }}
                      src={barcodePic}
                      alt=""
                    />
                  </Barcode>
                </BarcodeContainer> */}
              </Body>
              <Footer />
            </DetailsContainer>
          </Card>
        </CardContainer>
      </StyledViewIdCard>
    </div>
  );
}

ViewIdCard.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired, // Changed from string to func
};

export default ViewIdCard;
