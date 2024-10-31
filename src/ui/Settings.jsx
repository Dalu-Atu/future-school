import { useForm } from 'react-hook-form';
import { useGetSchoolSettings, useModifySettings } from '../services/settings';
import Spinner from './Spinner';
import Form, { FormRow, Input, Label } from '../ui/Form';
import styled from 'styled-components';
import Button from './Button';

const Header = styled.p`
  margin: 1rem;
  color: #adadad;
  letter-spacing: '20px';
  border-bottom: 10ch var(--color-gray-300);
  padding: 1rem;
`;
const StyledSettings = styled.div`
  padding: 1rem;
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

function Settings() {
  const { register, handleSubmit } = useForm();
  const { modifySettings, isModifying } = useModifySettings();
  const { data, isGettingSettings } = useGetSchoolSettings();

  const submittingForm = (data) => modifySettings(data);

  if (isModifying || isGettingSettings) return <Spinner size="medium" />;
  return (
    <StyledSettings>
      <Header>School Settings</Header>
      <Form onSubmit={handleSubmit(submittingForm)}>
        <StyledSettingsContainer>
          <FormRow>
            <Label>School Name</Label>

            <Input
              defaultValue={data?.schoolName}
              {...register('schoolName')}
            />
          </FormRow>
          <FormRow>
            <Label>Principals Name</Label>

            <Input
              defaultValue={data?.principalsName}
              {...register('principalsName')}
            />
          </FormRow>
          <FormRow>
            <Label>Head Mistress Name</Label>

            <Input
              defaultValue={data?.headMistressName}
              {...register('headMistressName')}
            />
          </FormRow>
          <FormRow>
            <Label>Current Section</Label>

            <Input
              defaultValue={data?.currentSection}
              {...register('currentSection')}
            />
          </FormRow>
          <FormRow>
            <Label>Current Term</Label>

            <Input
              defaultValue={data?.currentTerm}
              {...register('currentTerm')}
            />
          </FormRow>
          <FormRow>
            <Label>Resumption Date</Label>

            <Input
              defaultValue={data?.resumptionDate}
              {...register('resumptionDate')}
            />
          </FormRow>
        </StyledSettingsContainer>
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button type={'approve'}>Save Changes</Button>
        </div>
      </Form>
    </StyledSettings>
  );
}

export default Settings;
