import styled from 'styled-components';
import logo from '../assets/woman.avif';
import { useAuth } from '../services/AuthContext';
import { useTheme } from '../services/ThemeContext';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { uploadImage } from '../services/uploadFile';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import SpinnerMini from './SpinnerMini';

const StyledManagementProfile = styled.div`
  border-bottom: 1px solid var(--color-gray-300);
  height: 21rem;
`;
function ManagementProfile() {
  const { user } = useAuth();
  const { primaryColor } = useTheme();
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(user?.data.image || logo);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      setImageUrl(user?.data.image || logo);
    },
    [setImageUrl, user?.data.image]
  );

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const publicURL = await uploadImage(file, user.data.id, user.cartegory);
        setImageUrl(publicURL);
        setIsLoading(false);
      } catch (error) {
        console.error('Error uploading file:', error);
        setIsLoading(false);
      }
    }
  };

  return (
    <StyledManagementProfile>
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            border: `4px solid ${primaryColor}`,
            height: '11.9rem',
            width: '11.9rem',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isLoading ? (
            <SpinnerMini />
          ) : (
            <img
              style={{
                height: '10.5rem',
                borderRadius: '50%',
                width: '10.5rem',
              }}
              src={imageUrl}
              alt="Profile"
            />
          )}
        </div>
        <MdOutlineAddPhotoAlternate
          onClick={handleIconClick}
          size={'29px'}
          style={{
            cursor: 'pointer',
            position: 'relative',
            top: '4rem',
            left: '-3rem',
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <div
        style={{
          textAlign: 'center',
          lineHeight: '23px',
          marginBottom: '1rem',
        }}
      >
        <p style={{ fontWeight: '600' }}>{user?.data?.name}</p>
        <p style={{ fontWeight: '600', color: 'lightgrey' }}>
          {user?.cartegory}
        </p>
      </div>
    </StyledManagementProfile>
  );
}

export default ManagementProfile;

// stud
// teacher courses  class

// admin
// juniour secondry  teachers
// courses competed awards
