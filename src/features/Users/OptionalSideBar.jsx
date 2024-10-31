import styled from 'styled-components';
import Option from '../../ui/Option';
import TermDuration from '../../ui/TermDuration';

import { MdDashboard } from 'react-icons/md';
import { BsCardChecklist, BsPerson } from 'react-icons/bs';
import { TbReport } from 'react-icons/tb';
import { LiaSchoolSolid } from 'react-icons/lia';

const StyledManageActivitiesOption = styled.ul`
  color: var(--color-gray-500);
`;

function OptionalSidebar({ cartegory }) {
  if (cartegory === 'Teacher') return <TeachersNav />;
  if (cartegory === 'Student') return <StudentNav />;
}

const TeachersNav = function name() {
  return (
    <StyledManageActivitiesOption>
      <Option
        destination={`/account/dashboard`}
        icon={<MdDashboard size={'18px'} />} // to add or remove class and set the teacher
        value={'Dashboard'}
        colour={'#6b21a8'}
      />
      <Option
        destination={`/account/managemarks`}
        icon={<BsCardChecklist size={'18px'} />} // to add or remove class and set the teacher
        value={'Manage Marks'}
        colour={'#c34f4f'}
      />
      <Option
        destination={`/account/managereports`}
        icon={<TbReport size={'18px'} />} // to add or remove class and set the teacher
        value={'Manage Reports'}
        colour={'#049666'}
      />
      <TermDuration />
      <Option
        destination={`/account/classresults`}
        icon={<LiaSchoolSolid size={'18px'} />} // to add or remove class and set the teacher
        value={'Student Results'}
        colour={'#6b21a8'}
      />
      <Option
        destination={'/account/profile'}
        icon={<BsPerson size={'18px'} />} // to add or remove class and set the teacher
        value={'Profile'}
        colour={'#c34f4f'}
      />
    </StyledManageActivitiesOption>
  );
};
const StudentNav = function name() {
  return (
    <StyledManageActivitiesOption>
      <Option
        destination={`/account/dashboard`}
        icon={<MdDashboard size={'18px'} />} // to add or remove class and set the teacher
        value={'Dashboard'}
        colour={'#6b21a8'}
      />
      <Option
        destination={`/viewresult`}
        icon={<BsCardChecklist size={'18px'} />} // to add or remove class and set the teacher
        value={'View Result'}
        colour={'#c34f4f'}
      />
      <Option
        destination={`/account/profile`}
        icon={<BsPerson size={'18px'} />} // to add or remove class and set the teacher
        value={'Manage Reports'}
        colour={'#049666'}
      />
      <TermDuration />
    </StyledManageActivitiesOption>
  );
};

export default OptionalSidebar;
