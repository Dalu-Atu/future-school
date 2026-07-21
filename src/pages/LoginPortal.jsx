import styled, { keyframes } from "styled-components";
import background from "../assets/lab.jpeg";
import { useEffect, useState } from "react";
import {
  useLoginAdmin,
  useLoginStudent,
  useLoginTeacher,
} from "../services/apiAuth";
import SpinnerMini from "../ui/SpinnerMini";
import toast from "react-hot-toast";
import "../styles/login.css";
import { useSettings } from "../services/settingContext";
import { useAccessResult } from "../services/schoolStudents";
import { getClassess } from "../services/schoolClasses";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";

// ---- Result release control ----------------------------------------
const RESULT_DATE = new Date("2026-07-24T10:00:00");

function getTimeLeft() {
  const diff = RESULT_DATE.getTime() - Date.now();
  if (diff <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, done: false };
}

// ---- Countdown page styled-components --------------------------------
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
`;

const CountdownWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  margin-top: -2rem;
  margin-bottom: -3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 15% 20%,
      hsla(170, 90%, 25%, 0.35),
      transparent 45%
    ),
    radial-gradient(
      circle at 85% 80%,
      hsla(45, 90%, 55%, 0.12),
      transparent 40%
    ),
    linear-gradient(160deg, hsl(170, 65%, 8%) 0%, hsl(170, 90%, 5%) 100%);
  color: white;
`;

const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 36rem;
  background: hsla(170, 40%, 20%, 0.25);
  border: 1px solid hsla(170, 60%, 70%, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(18px);
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6);
  padding: 3.5rem 3rem;
  text-align: center;

  @media (max-width: 560px) {
    padding: 2.5rem 1.75rem;
  }
`;

const Logo = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  object-fit: contain;
  margin: 0 auto 1.5rem;
  display: block;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
`;

const Eyebrow = styled.p`
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: hsl(45, 90%, 65%);
`;

const Title = styled.h1`
  margin: 0 0 0.9rem;
  font-size: clamp(1.6rem, 4vw, 2.25rem);
  font-weight: 800;
  line-height: 1.25;
  color: white;
`;

const Subtitle = styled.p`
  margin: 0 auto 2.5rem;
  max-width: 26rem;
  font-size: 1.2rem;
  line-height: 1.6;
  color: hsla(0, 0%, 100%, 0.7);

  strong {
    color: white;
    font-weight: 700;
  }
`;

const TimerRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.9rem;
  margin-bottom: 2.5rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const TimeBlockBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimeValue = styled.div`
  width: 4.5rem;
  padding: 0.9rem 0;
  border-radius: 12px;
  background: hsla(0, 0%, 100%, 0.06);
  border: 1px solid hsla(0, 0%, 100%, 0.12);
  font-size: 1.65rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: white;

  @media (max-width: 480px) {
    width: 3.6rem;
    font-size: 1.3rem;
    padding: 0.7rem 0;
  }
`;

const TimeLabel = styled.span`
  margin-top: 0.6rem;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: hsla(0, 0%, 100%, 0.5);
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: hsla(0, 0%, 100%, 0.55);
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: hsl(150, 70%, 55%);
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

const Divider = styled.div`
  width: 3rem;
  height: 2px;
  margin: 0 auto 1.75rem;
  background: hsl(45, 90%, 60%);
  border-radius: 2px;
`;

const Footer = styled.p`
  position: relative;
  z-index: 1;
  margin-top: 1.75rem;
  text-align: center;
  font-size: 0.75rem;
  color: hsla(0, 0%, 100%, 0.3);
`;

function TimeBlock({ value, label }) {
  return (
    <TimeBlockBox>
      <TimeValue>{String(value).padStart(2, "0")}</TimeValue>
      <TimeLabel>{label}</TimeLabel>
    </TimeBlockBox>
  );
}
// ----------------------------------------------------------------------

const StyledLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  margin-top: -2rem;
  margin-bottom: -3rem;
  background-color: hsl(170, 90%, 12%);
  background-size: cover;
  background-position: center;
  color: white;
`;

const FormContainer = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FormContent = styled.div`
  position: relative;
  top: -2rem;
  margin-top: 2rem;
  padding-top: 5rem;
  padding-bottom: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const WelcomeSection = styled.div`
  overflow: hidden;
  /* border: 1px solid white; */
  height: calc(100vh - 10rem);
  width: 70%;
  border-radius: 10px;
  margin: 3rem;
  position: relative;
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(
      0,
      0,
      0,
      0.5
    ); /* Change the color and opacity as needed */
    z-index: 1; /* Ensure it sits above other content */
  }
`;

const Form = styled.form`
  width: 30%;
  height: calc(100vh - 10rem);

  @media (max-width: 1008px) {
    width: 100%;
  }
`;
const FormHeader = styled.h2`
  text-align: center;
  position: relative;
  top: 3rem;

  @media (max-width: 768px) {
    fontsize: small;
  }
`;
const InputFields = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const Input = styled.input`
  width: 33rem;
  height: 4.5rem;
  border-radius: 5px;
  margin-top: 10px;
  background-color: #ebebeb;
  padding-left: 5px;
  font-size: large;
  color: gray;
`;
const SelectInput = styled.select`
  width: 33rem;
  height: 4.3rem;
  border-radius: 5px;
  margin-top: 10px;
  background-color: #ebebeb;
  border: 1px solid white;
  color: gray;
`;
const LoginLabel = styled.label`
  position: relative;
  top: 10px;
  left: 5px;
`;
const StyledLogo = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  top: 2rem;
`;
const Slogan = styled.div`
  position: relative;
  top: -15rem;
  color: yellow;
  z-index: 2;
  margin-left: 5rem;
`;

function Login() {
  const [pin, setPin] = useState("");
  const [clsId, setClsId] = useState("");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const { accessResult, isAccessingResult } = useAccessResult();
  const { images, schoolName } = useSettings();

  const { isLoading, data, error } = useQuery({
    queryKey: ["classes"],
    queryFn: getClassess,
  });

  // Tick the countdown every second and flip over automatically once done
  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    accessResult({ pin, clsId });
  }

  const isResultDay = timeLeft.done;

  if (isLoading) return <Spinner />;

  // ---- Not yet result day: show the countdown page ----
  if (!isResultDay) {
    return (
      <CountdownWrapper>
        <Card>
          {images?.logo && <Logo src={images.logo} alt="logo" />}

          <Eyebrow>
            {schoolName ? schoolName.toUpperCase() : "SCHOOL PORTAL"}
          </Eyebrow>
          <Title>Results aren&apos;t out yet</Title>
          <Divider />
          <Subtitle>
            Sit tight — results will be available on{" "}
            <strong>24th July 2026 (10am)</strong>. Check back then to access your
            results.
          </Subtitle>

          <TimerRow>
            <TimeBlock value={timeLeft.days} label="Days" />
            <TimeBlock value={timeLeft.hours} label="Hrs" />
            <TimeBlock value={timeLeft.minutes} label="Min" />
            <TimeBlock value={timeLeft.seconds} label="Sec" />
          </TimerRow>

          <StatusRow>
            <StatusDot />
            We&apos;ll be ready for you soon
          </StatusRow>
        </Card>

        <Footer>
          &copy; {new Date().getFullYear()} {schoolName || "School"}. All rights
          reserved.
        </Footer>
      </CountdownWrapper>
    );
  }

  // ---- Result day has arrived: show the existing login form ----
  return (
    <StyledLogin className="contain">
      <FormContainer className="login-container">
        <WelcomeSection className="welcome-section">
          <img
            src={background}
            alt="img"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
            }}
          />
          <Slogan>
            <i>
              <h2>{schoolName.toUpperCase()}</h2>
            </i>
            <h4>Bringing Your Child Up to Eduational Speed</h4>
            <div
              style={{
                width: "15rem",
                backgroundColor: "yellow",
                height: "0.2rem",
                marginTop: "1rem",
              }}
            ></div>
            <i style={{ color: "#ffffab" }}>
              <p>The future begins from today as weknow it</p>
            </i>
          </Slogan>
        </WelcomeSection>

        <Form className="login-form" onSubmit={handleSubmit}>
          <StyledLogo>
            <img
              style={{
                width: "14rem",
              }}
              src={images.logo}
              alt="logo"
            />
          </StyledLogo>
          <FormHeader>ORUESE INTERNATIONAL SCHOOL PORTAL</FormHeader>
          <FormContent>
            <InputFields>
              <LoginLabel>PIN</LoginLabel>
              <Input value={pin} onChange={(e) => setPin(e.target.value)} />

              <LoginLabel>SERIAL NO</LoginLabel>
              <Input />

              <br />
              <SelectInput onChange={(e) => setClsId(e.target.value)}>
                <option value="">Choose class</option>
                {data.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </SelectInput>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "inherit",
                }}
              >
                <button
                  className="login-btn"
                  style={{
                    width: "28rem",
                    borderRadius: "5px",
                    color: "black",
                    backgroundColor: "yellow",
                    fontWeight: "700",
                    borderStyle: "none",
                    height: "4.5rem",
                    position: "relative",
                    bottom: "-5rem",
                    fontSize: "20px",
                  }}
                >
                  {!isAccessingResult ? "Submit" : <SpinnerMini />}
                </button>
              </div>
            </InputFields>
          </FormContent>
        </Form>
      </FormContainer>
    </StyledLogin>
  );
}

export default Login;
