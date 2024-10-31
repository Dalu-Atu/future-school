import styled from 'styled-components';
import Option from './Option';
import TermDuration from './TermDuration';
import {
  HiMiniTableCells,
  HiMiniUserGroup,
  HiMiniUsers,
} from 'react-icons/hi2';
import { useTheme } from '../services/ThemeContext';
import { useLocation } from 'react-router-dom';

const StyledManageActivitiesOption = styled.ul`
  z-index: 2;
  /* margin-top: 0rem; */
  color: var(--color-gray-500);
`;

function ManageActivitiesOption() {
  const { primaryColor, secondaryColor } = useTheme();
  const location = useLocation();

  // Determine the base path dynamically
  const basePath = location.pathname.startsWith('/dashboard')
    ? '/dashboard'
    : '/manageschool';

  return (
    <StyledManageActivitiesOption>
      <Option
        destination={`${basePath}/manageclass`}
        icon={<HiMiniTableCells />} // to add or remove class and set the teacher
        value={'Manage Class'}
        colour={'#6b21a8'}
        $bg={'#d8b4fe'}
      />
      <Option
        destination={`/manageteachers`}
        icon={<HiMiniUsers />} // to add teachers details or delete teachers
        value={'Manage Teachers'}
        colour={'#10b981'}
        $bg={'#6ee7b7'}
      />
      <Option
        destination={`${basePath}/managestudents`}
        icon={<HiMiniUserGroup />} // show class then select class and show class overview
        value={'Manage Students'}
        colour={`#fca5a5`}
        $bg={'#fee2e2'}
      />
      <TermDuration />
      <Option
        destination={`${basePath}/managesubject`}
        icon={<HiMiniUserGroup />} // show and select class then show a subject overview, with all subjects and can add more button
        value={'Manage Subject'}
        colour={`#fca5a5`}
        $bg={'#fee2e2'}
      />
      <Option
        destination={`/managexam`}
        icon={<HiMiniUsers />}
        value={'Manage Exams'}
        colour={'#10b981'}
        $bg={'#6ee7b7'}
      />
    </StyledManageActivitiesOption>
  );
}

export default ManageActivitiesOption;
