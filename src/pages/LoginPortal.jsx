import styled from "styled-components";
import background from "../assets/lab.jpeg";
import { useState } from "react";
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
  const { accessResult, isAccessingResult } = useAccessResult();
  const { images, schoolName } = useSettings();

  const { isLoading, data, error } = useQuery({
    queryKey: ["classes"],
    queryFn: getClassess,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    accessResult({ pin, clsId });
  }

  if (isLoading) return <Spinner />;
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
