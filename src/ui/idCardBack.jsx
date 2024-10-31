import styled from "styled-components";
import qR from "../assets/qrcode.png";
import PropTypes from "prop-types";
import { HiPhone, HiOutlineGlobeAlt, HiOutlineEnvelope } from "react-icons/hi2";
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

const CardContainer = styled.div`
  display: flex;
  justify-content: center; // Center the card within the container
`;

const Card = styled.div`
  padding: 0rem 0.5rem;
  border: 2px solid lightgray;
  width: 60mm; /* Adjusted size to fit 9 cards on an A4 page */
  height: 90mm; /* Adjusted size to fit 9 cards on an A4 page */
  margin: 1rem;
`;

const SchoolName = styled.p`
  font-size: 12px;
  text-align: center;
  font-style: italic;
  font-weight: 1000;
  color: rgb(5, 0, 49);
  word-spacing: 6px;
  margin: 10px 0;
`;

const Content = styled.div`
  margin: 0 auto;
`;

const Detail = styled.p`
  font-size: small;
  color: rgb(5, 0, 49);
  margin-top: 1rem;
  line-height: 1.5rem;
  font-style: italic;
`;

const Footer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

const Label = styled.h4`
  color: rgb(5, 0, 49);
  font-weight: bold;
  border-bottom: 2px solid rgb(5, 0, 49);
  margin-top: 20px;
`;

const ContactDetailContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const DetailList = styled.p`
  font-size: small;
  display: flex;
  align-items: center;
`;

const Span = styled.span`
  margin-right: 5px;
`;

const Box = styled.div`
  width: 5rem;
  height: 5rem;
`;

function IdCardBack({ data, handleClick }) {
  const { username, password } = data;
  const settings = useSettings();

  return (
    <StyledViewIdCard>
      <CardContainer>
        <Card onClick={handleClick} style={{ cursor: "pointer" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <img
              style={{
                height: "6rem",
                width: "7rem",
                borderRadius: "50%",
                padding: "3px",
              }}
              src={settings.images.logo}
              alt=""
            />
          </div>
          <SchoolName>{settings.schoolName.toUpperCase()}</SchoolName>
          <Content>
            <ul>
              <Detail>
                This ID card serves as your official identification and access
                pass at {settings.schoolName}. It also contains your pin and
                serial number for the school portal. Please handle it with care
                and report any loss immediately to the school office.
              </Detail>
            </ul>
          </Content>
          <Footer>
            <Label>CONTACT US</Label>
            <ContactDetailContainer>
              <div>
                <DetailList>
                  <Span style={{ color: "rgb(5, 0, 49)" }}>
                    <HiPhone />
                  </Span>
                  <span> +234 912720764</span>
                </DetailList>
                <DetailList>
                  <Span style={{ color: "rgb(5, 0, 49)" }}>
                    <HiOutlineGlobeAlt />
                  </Span>
                  <span>www.osiportal.com</span>
                </DetailList>
                <DetailList>
                  <Span style={{ color: "rgb(5, 0, 49)" }}>
                    <HiOutlineEnvelope />
                  </Span>
                  <span>oisportal@gmail.com</span>
                </DetailList>
              </div>
              <Box>
                <img src={qR} alt="" />
              </Box>
            </ContactDetailContainer>
          </Footer>
        </Card>
      </CardContainer>
    </StyledViewIdCard>
  );
}

IdCardBack.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default IdCardBack;
