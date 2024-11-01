import React from "react";
import { useTheme } from "../services/ThemeContext";
import styled from "styled-components";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StyledStatisticsChart = styled.div`
  background-color: var(--color-white);
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
`;

function StatisticChart({ data }) {
  const students = data.secondaryStudents;

  const statsArray = [
    { name: "JSS 1", uv: 1000, pv: 2400, amt: 2400, class: 30 },
    { name: "JSS 2", uv: 3000, pv: 1398, amt: 2210, class: 20 },
    { name: "JSS 3", uv: 2000, pv: 9800, amt: 2290, class: 50 },
    { name: "SS 1", uv: 2780, pv: 3908, amt: 2000, class: 20 },
    { name: "SS 2", uv: 1890, pv: 4800, amt: 2181, class: 18 },
    { name: "SS 3", uv: 2390, pv: 3800, amt: 2500, class: 70 },
  ];

  const countStudentsByClass = (students) => {
    const counts = {};

    students.forEach((student) => {
      const classId = student.class_id;
      if (!counts[classId]) {
        counts[classId] = 0;
      }
      counts[classId]++;
    });

    return counts;
  };

  const updateStatsArrayWithCounts = (statsArray, counts) => {
    return statsArray.map((stat) => {
      const classCount = counts[stat.name] || 0;
      return { ...stat, class: classCount };
    });
  };

  const studentCounts = countStudentsByClass(students);
  const updatedStatsArray = updateStatsArrayWithCounts(
    statsArray,
    studentCounts
  );

  const { primaryColor } = useTheme();
  return (
    <StyledStatisticsChart>
      <div style={{ width: "100%" }}>
        <h4 style={{ color: "#7f7f7f" }}>Statistics</h4>
        <ResponsiveContainer
          width="115%"
          height={170}
          style={{ position: "relative", top: "1rem", right: "2.5rem" }}
        >
          {/* <ResponsiveContainer width="100%" height={200}> */}
          <AreaChart
            width={500}
            height={200}
            data={updatedStatsArray}
            syncId="anyId"
            margin={{
              top: 1,
              right: 50,
              left: 0,
              bottom: 0,
            }}
          >
            {/* <CartesianGrid strokeDasharray="0.1" /> */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              // type="monotone"
              dataKey="class"
              stroke={primaryColor}
              fill={primaryColor}
            />
          </AreaChart>
          {/* </ResponsiveContainer> */}
        </ResponsiveContainer>
      </div>
    </StyledStatisticsChart>
  );
}

export default StatisticChart;
