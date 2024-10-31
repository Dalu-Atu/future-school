import styled from 'styled-components';
import ManagementProfile from '../../ui/ManagementProfile';
import ManageActivities from '../Admin/ManageActivities';
import { useAuth } from '../../services/AuthContext';
import { useSettings } from '../../services/settingContext';
const StyledProfileDescription = styled.div`
  margin: 1rem;
  border-bottom: 1px solid lightgray;
`;
const DescriptionCard = styled.div`
  font-weight: 1px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem;
  text-align: center;
  background-color: var(--color-gray-100);
  border-radius: 5px;
`;
const DescriptionComment = styled.div`
  margin-top: 2rem;
  letter-spacing: 21x;
  margin-bottom: 5rem;
`;

function UsersProfile() {
  const { user } = useAuth();
  const settings = useSettings();

  return (
    <div>
      <ManageActivities>
        <ManagementProfile />
        <StyledProfileDescription>
          <DescriptionCard>
            <p>Username</p> <p>{user.data.username}</p>
          </DescriptionCard>
          <DescriptionCard>
            <p>Password</p> <p>{`${user.data.password}`}</p>
          </DescriptionCard>
          <DescriptionCard>
            <p>Gender</p> <p>{user.data.gender}</p>
          </DescriptionCard>
          <DescriptionCard>
            <p>Date of birth</p>
            <p>
              <i>Not specified</i>
            </p>
          </DescriptionCard>
          <DescriptionComment>
            <h4 style={{ marginBottom: '1rem' }}>Description</h4>
            {user.cartegory === 'Student' && (
              <p>{` ${user.data.name} is a dedicated and ambitious student at
              ${settings.schoolName}, known for their
              curiosity and eagerness to learn. With a strong passion,${user.data.name}  consistently strives to excel in both
              academic and extracurricular activities.${user.data.name} has a natural
              inquisitiveness that drives them to explore various subjects and
              engage deeply with their studies.`}</p>
            )}
            {user.cartegory === 'Teacher' && (
              <p>{`${user.data.name} is an inspiring and dedicated teacher at ${settings.schoolName}, renowned for their commitment to education and student success. With a wealth of knowledge and a passion for teaching, ${user.data.name} consistently goes above and beyond to create an engaging and supportive learning environment. Their enthusiasm for fostering intellectual curiosity and academic excellence makes them a cherished mentor to students and a valued member of the school community.`}</p>
            )}
          </DescriptionComment>
        </StyledProfileDescription>
      </ManageActivities>
    </div>
  );
}
export default UsersProfile;
