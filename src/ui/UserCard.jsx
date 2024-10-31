import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Notification } from './Modal';
import avatarWoman from '../assets/woman.avif';

const StyledStudent = styled.div`
  /* color: var(--color-gray-600); */
  margin: 1.3rem 2rem 1rem 2rem;
  background-color: var(--color-gray-300);
  box-shadow: 0px 3px 1px var(--color-gray-300),
    0px 3px 1px var(--color-gray-300);
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  align-items: center;
  text-align: center;
  padding-right: 5px;
  @media (max-width: 1130px) {
    margin: 1.3rem 2rem 1rem 0rem;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    & > *:nth-child(2) {
      display: none;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    & > *:nth-child(5) {
      position: relative;
      left: -1.5rem;
    }
    & > *:nth-child(4) {
      position: relative;
      left: -5rem;
    }
    & > *:nth-child(3) {
      display: none;
    }
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr 1fr;
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(5) {
      position: relative;
      left: 1.5rem;
    }
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  margin: 1rem;
  align-items: center;
  overflow: hidden;
  width: max-content;
`;

const AvatarContainer = styled.div`
  overflow: hidden;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`;

const AvatarImage = styled.img`
  overflow: hidden;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`;

const UserDetails = styled.div`
  font-size: small;
  position: relative;
  left: 10px;
  top: 5px;
  padding-right: 1rem;
  width: 17rem;
  text-align: left;
`;

const UserName = styled.p`
  margin: 0;
`;

const UserLabel = styled.p`
  margin: 0;
  text-align: left;
`;

const UserInfoField = styled.div`
  border: 1px solid var(--color-gray-400);
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  top: 0rem;
  left: 5rem;
  width: 8rem;

  @media (max-width: 872px) {
    position: relative;
    left: 3rem;
  }
  @media (max-width: 676px) {
    position: relative;
    left: 2rem;
  }
`;

const ActionButton = styled.button`
  color: ${({ color }) => color};
`;

function UserCard({ handleEdit, handleDelete, image, name, label, id }) {
  const [action, setConfirmAction] = useState(false);

  if (action)
    return (
      <Notification
        message="Are you sure you want to delete this user"
        takeAction={handleDelete}
        revokeAction={setConfirmAction}
      />
    );

  return (
    <StyledStudent>
      <UserInfoContainer>
        <AvatarContainer>
          <AvatarImage src={image || avatarWoman} alt={image} />
        </AvatarContainer>
        <UserDetails>
          <UserName>{name}</UserName>
          <UserLabel>{label}</UserLabel>
        </UserDetails>
      </UserInfoContainer>
      <UserInfoField>
        <p>{id.username}</p>
      </UserInfoField>
      <UserInfoField>
        <p>{id.gender}</p>
      </UserInfoField>
      <UserInfoField>
        <p>{id.section}</p>
      </UserInfoField>
      <ActionsContainer>
        <ActionButton onClick={() => handleEdit(id)} color="#44a08d">
          Edit
        </ActionButton>
        <ActionButton onClick={() => setConfirmAction(true)} color="orangered">
          Delete
        </ActionButton>
      </ActionsContainer>
    </StyledStudent>
  );
}

UserCard.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default UserCard;
