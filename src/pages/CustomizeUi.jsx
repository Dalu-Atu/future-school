import styled from "styled-components";

import Spinner from "../ui/Spinner";
import { useModifySettings } from "../services/settings";

import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../services/ThemeContext";

const PageHeader = styled.h3`
  margin: 1rem;
`;
const StyledSettings = styled.div`
  height: calc(100vh - 58px);
  padding: 1rem;
  overflow: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: Just make scrollbar invisible */
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none; /* For Firefox */
`;

const SettingsSelection = styled.ul`
  width: max-content;
  border: 1px solid var(--color-gray-300);
  background-color: var(--color-gray-300);
  height: 3.3rem;
  border-radius: 6px;
  margin-left: 1.5rem;
  display: flex;
  align-items: center;
`;
const SelectionList = styled(Link)`
  width: max-content;
  border-radius: 7px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ isActive, color }) =>
    isActive ? `${color}` : "transparent"};
  color: ${({ isActive }) => (isActive ? "white" : "inherit")};
  cursor: pointer;

  &:hover {
    background-color: var(--color-gray-400);
  }
`;
const StyledButton = styled.button`
  position: relative;
  top: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 2rem;
  /* height: 3rem; */
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 6px;
  border-style: none;
  background-color: ${({ color }) => color};
  color: var(--color-gray-100);

  @media (max-width: 505px) {
    min-width: 13rem;
    font-size: small;
    position: relative;
    right: 5rem;
  }
  @media (max-width: 486px) {
    position: relative;
    right: 7rem;
  }
  @media (max-width: 426px) {
    position: relative;
    right: 20rem;
  }
  @media (max-width: 370px) {
    position: relative;
    left: -10rem;
  }
`;

function CustomizeUi() {
  const { primaryColor, currSettings } = useTheme();
  const [activeSelection, setActiveSelection] = useState("Basic Info"); // Default active selection
  const { modifySettings, isModifying } = useModifySettings();
  function HandleUpdateSettings() {
    modifySettings(currSettings);
  }

  const handleSelectionClick = (selection) => {
    setActiveSelection(selection);
  };

  if (isModifying) return <Spinner />;
  return (
    <StyledSettings>
      <PageHeader>Customize Ui</PageHeader>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SettingsSelection>
          {["Basic Info", "Appearance", "Edit Website"].map((selection) => (
            <SelectionList
              color={primaryColor}
              key={selection}
              to={`/customize/${selection.toLowerCase().replace(" ", "-")}`} // Assuming you are using react-router
              isActive={activeSelection === selection}
              onClick={() => handleSelectionClick(selection)}
            >
              {selection}
            </SelectionList>
          ))}
        </SettingsSelection>
        <StyledButton onClick={HandleUpdateSettings} color={primaryColor}>
          Save Changes
        </StyledButton>
      </div>
      {<Outlet />}
    </StyledSettings>
  );
}

export default CustomizeUi;

// all the components to be renderd in the outlet
// 2738877740;
// SN-WTU8-VIPD-QBO8;
