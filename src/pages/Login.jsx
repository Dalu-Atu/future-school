import styled from "styled-components";
import background from "../assets/groupstudent.jpg";
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
  top: -3rem;
  margin-top: 0rem;
  padding-top: 5rem;
  padding-bottom: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 40%;
  height: calc(100vh - 10rem);
`;
const FormHeader = styled.h2`
  text-align: center;
  position: relative;
  top: 3rem;
`;
const InputFields = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const Input = styled.input`
  width: 33rem;
  height: 4.3rem;
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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [cartegory, setCartegory] = useState("Admin");
  const { loginTeacherIn, isLoggingTeacherIn } = useLoginTeacher();
  const { loginStudentIn, isLoggingStudentIn } = useLoginStudent();
  const { loginAdmin, isLoggingIn } = useLoginAdmin();
  const { images, schoolName } = useSettings();

  async function handleSubmit(e) {
    const email = `${name}@gmail.com`;
    e.preventDefault();
    if (!email || !password)
      return toast.error("please provide a valid email and password");

    if (cartegory === "Teacher")
      return loginTeacherIn({ email, password, cartegory });
    if (cartegory === "Student")
      return loginStudentIn({ email, password, cartegory });
    if (cartegory === "Admin")
      return loginAdmin({ email, password, cartegory });
  }

  return (
    <StyledLogin className="contain">
      <FormContainer className="login-container">
        <WelcomeSection className="welcome-section">
          <img
            src={background}
            alt="img"
            style={{
              display: "block",
              maxWidth: "100%",
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
          <FormHeader style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            Welcome Back
          </FormHeader>
          <FormContent>
            <InputFields>
              <LoginLabel>Username</LoginLabel>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().trim())}
              />

              <LoginLabel>Password</LoginLabel>

              <Input
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.toLowerCase().trim())
                }
              />

              <LoginLabel>Cartegory</LoginLabel>
              <br />
              <SelectInput
                value={cartegory}
                onChange={(e) => setCartegory(e.target.value)}
              >
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
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
                  }}
                >
                  {!isLoggingTeacherIn &&
                  !isLoggingStudentIn &&
                  !isLoggingIn ? (
                    "Login"
                  ) : (
                    <SpinnerMini />
                  )}
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
