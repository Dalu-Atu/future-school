import styled from 'styled-components';
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../services/ThemeContext';

const StyledReadingMeter = styled.div`
  width: inherit;
  height: 30rem;
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: 0px 0px 0px 1px var(--color-white);
  border: 0.2px solid ligtgray;
`;

const data = [
  {
    subject: 'Math',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Biology',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'English',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Geography',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Physics',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'History',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

function SubjectGraph() {
  const { primaryColor } = useTheme();

  return (
    <StyledReadingMeter>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          e <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Mike"
            dataKey="A"
            stroke={primaryColor}
            fill={primaryColor}
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </StyledReadingMeter>
  );
}

export default SubjectGraph;
