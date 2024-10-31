import styled from 'styled-components';

import TeacherStats from './ClassStatistics';
import NewStudentContainer from './NewStudentContainer';
import AnalyticsBox from '../../ui/AnalyticsBox';
import { useTheme } from '../../services/ThemeContext';
import UserAnalytics from './UserAnalytics';
import { getSchoolStatistics } from '../../services/teachersService';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../ui/Spinner';
import { useAuth } from '../../services/AuthContext';

const Style = styled.div``;

function TeachersDasbboardOverview() {
  const { data: statistics, isLoading: gettingStats } = useQuery({
    queryFn: () => getSchoolStatistics(),
    queryKey: ['school stats'],
  });
  const { user, isLoading } = useAuth();
  const section = user.data.section;
  const { primaryColor, secondaryColor } = useTheme();

  const studentStats = statistics?.students[section + 'Students'].length;
  const teacherStats = statistics?.teachers.filter(
    (tch) => tch.section === section
  ).length;

  if (isLoading || gettingStats) return <Spinner />;
  return (
    <Style>
      <UserAnalytics>
        <AnalyticsBox
          name={
            section === 'primary'
              ? 'Pri Students'
              : section === 'pc'
              ? 'PC Students'
              : 'Sec Students'
          }
          totalNo={studentStats}
          colour={primaryColor}
        />
        <AnalyticsBox
          name={
            section === 'primary'
              ? 'Pri Teachers'
              : section === 'pc'
              ? 'PC Teachers'
              : 'Sec Teachers'
          }
          totalNo={teacherStats}
          colour={primaryColor}
        />
      </UserAnalytics>
      <TeacherStats />
      <NewStudentContainer />
    </Style>
  );
}

export default TeachersDasbboardOverview;
