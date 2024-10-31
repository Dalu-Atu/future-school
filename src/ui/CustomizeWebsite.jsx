// import styled from 'styled-components';
// import NewForm, { InputBox } from './NewForm';
// import { Input } from './Form';

// const Header = styled.p`
//   margin: 1rem;
//   /* color: #adadad; */
//   letter-spacing: '20px';
//   border-bottom: 1px solid lightgrey;
//   padding: 1rem;
// `;
// const StyledCustomizeWebsite = styled.div`
//   /* background-color: var(--color-gray-100);
//   height: calc(100vh - 65px); */
//   padding: 1rem;
// `;
// const Section = styled.div`
//   margin-top: 1.5rem;
//   padding-left: 2rem;
// `;
// const SectionHeader = styled.div`
//   /* color: #adadad;
//   font-size: small; */
// `;
// const SectionInput = styled.div`
//   /* display: flex;
//   margin-top: 1.5rem;
//   justify-content: space-between; */
//   width: 33rem;
// `;
// const SectionInputWithImg = styled.div`
//   display: flex;
//   margin-top: 1.5rem;
//   justify-content: space-between;
//   align-items: center;
//   width: 37rem;
// `;
// function Sections() {
//   return (
//     <Section>
//       <SectionHeader>Section One</SectionHeader>
//       <SectionInput>
//         <p>Title</p>
//         <Input value={'jhgfdfg'} />
//       </SectionInput>
//       <SectionInput>
//         <p>Slogan</p>
//         <Input value={'jhgfdfg'} />
//       </SectionInput>
//       <SectionInput>
//         <p>Button</p>
//         <Input value={'jhgfdfg'} />
//       </SectionInput>
//       <SectionInputWithImg>
//         <img
//           src=""
//           alt=""
//           style={{
//             height: '8rem',
//             width: '8rem',
//             border: '1px solid black',
//           }}
//         />
//         <Input value={'Choose Image'} />
//       </SectionInputWithImg>
//       <SectionInputWithImg>
//         <img
//           src=""
//           alt=""
//           style={{
//             height: '8rem',
//             width: '8rem',
//             border: '1px solid black',
//           }}
//         />
//         <Input value={'Choose Image'} />
//       </SectionInputWithImg>
//     </Section>
//   );
// }
// function SectionTwo() {
//   return (
//     <Section>
//       <SectionHeader>Section One</SectionHeader>
//       <SectionInput>
//         <p>Title</p>
//         <Input value={'jhgfdfg'} />
//       </SectionInput>
//       <SectionInput>
//         <p>Slogan</p>
//         <Input value={'jhgfdfg'} />
//       </SectionInput>
//       <SectionInput>
//         <p>Button</p>
//         <Input value={'jhgfdfg'} />
//       </SectionInput>
//       <SectionInputWithImg>
//         <img
//           src=""
//           alt=""
//           style={{
//             height: '8rem',
//             width: '8rem',
//             border: '1px solid black',
//           }}
//         />
//         <Input value={'Choose Image'} />
//       </SectionInputWithImg>
//       <SectionInputWithImg>
//         <img
//           src=""
//           alt=""
//           style={{
//             height: '8rem',
//             width: '8rem',
//             border: '1px solid black',
//           }}
//         />
//         <Input value={'Choose Image'} />
//       </SectionInputWithImg>
//     </Section>
//   );
// }
// function CustomizeWebsite() {
//   return (
//     <StyledCustomizeWebsite>
//       <Header>Customize Website</Header>
//       <Sections />
//       <SectionTwo />
//     </StyledCustomizeWebsite>
//   );
// }

// export default CustomizeWebsite;
import PropTypes from 'prop-types';
import { useTheme } from '../services/ThemeContext';
import styled from 'styled-components';
import NewForm, { InputBox } from './NewForm';
import Form, { FormRow, Input, Label } from './Form';
import { useForm } from 'react-hook-form';
import { useModifySettings } from '../services/settings';
import FileInput from './FileInput';
import { uploadFile } from '../services/uploadFile';
import { useState } from 'react';

const Header = styled.p`
  margin: 1rem;
  /* color: #adadad; */
  letter-spacing: '20px';
  border-bottom: 1px solid lightgrey;
  padding: 1rem;
`;
const StyledCustomizeWebsite = styled.div`
  /* background-color: var(--color-gray-100);
  height: calc(100vh - 65px); */
  padding: 1rem;
`;
const Section = styled.div`
  margin-top: 1.5rem;
  /* padding-left: 2rem; */
`;
const SectionHeader = styled.div`
  color: var(--color-gray-600);
  margin-left: 2rem;
`;
const StyledSettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 726px) {
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  @media (max-width: 526px) {
    grid-template-columns: 1fr;
    margin-left: rem;
  }

  input {
    @media (max-width: 1214px) {
      width: 26rem;
    }
    @media (max-width: 894px) {
      width: 24rem;
    }
    @media (max-width: 830px) {
      width: 21rem;
    }
    @media (max-width: 726px) {
      width: 30rem;
    }
    @media (max-width: 674px) {
      width: 28rem;
    }
    @media (max-width: 630px) {
      width: 25rem;
    }
    @media (max-width: 578px) {
      width: 22rem;
    }
    @media (max-width: 526px) {
      width: 32rem;
    }
    @media (max-width: 378px) {
      width: 30rem;
    }
    @media (max-width: 350px) {
      width: 27rem;
    }
  }
`;
const SectionInput = styled.div`
  /* display: flex;
  margin-top: 1.5rem;
  justify-content: space-between; */
  width: 33rem;
`;
const SectionInputWithImg = styled.div`
  display: flex;
  margin-top: 0.9rem;
  justify-content: space-between;
  align-items: center;
  width: 30rem;
  margin-left: 2rem;
`;
function Sections({ handleChangeFn, settingsId }) {
  const { currSettings } = useTheme();
  const SectionsImg = [
    'logo',
    'image1',
    'image2',
    'image3',
    'image4',
    'image5',
    'image6',
    'image7',
    'image8',
    'image9',
    'image10',
    'stamp',
  ];
  const [imageUrls, setImageUrls] = useState(currSettings.images || {});
  const [formValues, setFormValues] = useState({
    title: currSettings.title || '',
    slogan: currSettings.slogan || '',
    button: currSettings.button || '',
    comment: currSettings.comment || '',
  });

  async function handleFileChange(e, name) {
    const file = e.target.files[0];
    if (file) {
      try {
        const publicURL = await uploadFile(file, name, currSettings.id);
        setImageUrls((prev) => ({ ...prev, [name]: publicURL }));
        handleChangeFn({
          name: 'images',
          value: { ...imageUrls, [name]: publicURL },
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    handleChangeFn({ name, value });
  }

  return (
    <Section>
      <SectionHeader>Website Info</SectionHeader>
      <Form>
        <StyledSettingsContainer>
          {['title', 'slogan', 'button'].map((data) => (
            <FormRow key={data}>
              <Label>{data}</Label>
              <Input
                name={data}
                value={formValues[data]}
                onChange={handleChange}
              />
            </FormRow>
          ))}
        </StyledSettingsContainer>

        <div style={{ marginTop: '2rem' }}>
          <SectionHeader>Website Images</SectionHeader>
          {SectionsImg.map((imageField) => (
            <SectionInputWithImg key={imageField}>
              <img
                src={imageUrls[imageField] || currSettings.images?.[imageField]} // Use the current settings or the selected image
                alt=""
                style={{
                  height: '8rem',
                  width: '15rem',
                  overflow: 'hidden',
                }}
              />
              <FileInput
                name={imageField}
                onChange={(e) => handleFileChange(e, imageField)}
              />
            </SectionInputWithImg>
          ))}
        </div>
      </Form>
    </Section>
  );
}

function CustomizeWebsite() {
  const { handleSettingsOnChanges } = useTheme();

  return (
    <StyledCustomizeWebsite>
      <Header>Customize Website</Header>
      <Sections handleChangeFn={handleSettingsOnChanges} />
    </StyledCustomizeWebsite>
  );
}

Sections.propTypes = {
  handleChangeFn: PropTypes.string.isRequired,
  settingsId: PropTypes.string.isRequired,
};

export default CustomizeWebsite;
