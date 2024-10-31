import styled from 'styled-components';
import lightMode from '../assets/lightModePic.png';
import datkMode from '../assets/DarkModePic.png';
import defaultTheme from '../assets/captur.jpg';
import React from 'react';
import { SketchPicker } from 'react-color';
import { useTheme } from '../services/ThemeContext';
import { useDarkMode } from '../services/DarkModeContext';

const Header = styled.p`
  margin: 1rem;
  /* color: #adadad; */
  letter-spacing: '20px';
  border-bottom: 1px solid lightgrey;
  padding: 1rem;
`;
const StyledAppearanceSection = styled.div`
  /* background-color: var(--color-gray-100);
  height: calc(100vh - 65px); */
  padding: 1rem;
`;

const Section = styled.div`
  margin-top: 1.5rem;
  padding-left: 2rem;
`;
const SectionHeader = styled.div`
  /* color: #adadad;
  font-size: small; */
`;
const ThemeContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

const ThemeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: ${({ isActive, color }) =>
    isActive ? `3px solid ${color}` : '1px solid lightgray'};
  border-radius: 10px;
  padding: 10px;
  background: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const ThemeImg = styled.img`
  border-radius: 10px;
  height: 15rem;
`;
const SelectColourContainer = styled.div`
  margin-top: 0rem;
  display: flex;

  width: calc(100vw - 5rem);
  overflow: hidden;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: Just make scrollbar invisible */
  }
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
`;

const ChooseColour = styled.div`
  text-align: center;
  margin: 0.5rem;
`;

function CustomizeApearance() {
  const {
    secondaryColor,
    primaryColor,
    handlePrimaryColour,
    handleSecondaryColour,
  } = useTheme();

  const { isDarkMode, setMode } = useDarkMode();
  return (
    <StyledAppearanceSection>
      <Header>Customize Appearance</Header>
      <Section>
        <SectionHeader>Theme Mode</SectionHeader>
        <p style={{ fontSize: 'small', color: '#adadad' }}>
          Select your default theme
        </p>
        <ThemeContainer>
          <ThemeButton
            color={primaryColor}
            isActive={isDarkMode === true || isDarkMode === 'dark'}
            onClick={() => setMode('dark')}
          >
            <ThemeImg src={datkMode} alt="Dark Mode" />
            <p>Dark</p>
          </ThemeButton>
          <ThemeButton
            color={primaryColor}
            isActive={!isDarkMode === true || isDarkMode === 'default'}
            onClick={() => setMode('default')}
          >
            <ThemeImg src={defaultTheme} alt="System Default" />
            <p>System default</p>
          </ThemeButton>
          <ThemeButton
            color={primaryColor}
            isActive={!isDarkMode === true || isDarkMode === 'light'}
            onClick={() => setMode('light')}
          >
            <ThemeImg src={lightMode} alt="Light Mode" />
            <p>Light</p>
          </ThemeButton>
        </ThemeContainer>
      </Section>

      <Section>
        <SectionHeader>Colour Mode</SectionHeader>
        <p style={{ fontSize: 'small', color: '#adadad' }}>
          Select your default colours
        </p>
        <SelectColourContainer>
          <ChooseColour>
            <p style={{ paddingRight: '2rem' }}>Primary Colour</p>
            <SketchPicker
              color={primaryColor}
              onChangeComplete={handlePrimaryColour}
            />
          </ChooseColour>
          <ChooseColour>
            <p style={{ paddingRight: '2rem' }}>Secondary Colour</p>
            <SketchPicker
              color={secondaryColor}
              onChangeComplete={handleSecondaryColour}
            />
          </ChooseColour>
        </SelectColourContainer>
      </Section>
    </StyledAppearanceSection>
  );
}

export default CustomizeApearance;
