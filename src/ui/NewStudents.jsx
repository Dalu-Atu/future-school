import NewIntake from './NewIntake';
import Student from './Student';

import femaleAvatar from '../assets/woman.avif';

// const StyledStudents = styled.div`
//   border-radius: 8px;
//   background-color: var(--color-white);
//   overflow-y: hidden;
//   height: max-content;
// `;

function NewStudents({ data }) {
  let image;
  const newStudents = data.students
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    // <StyledStudents>
    <NewIntake label1="New Students">
      {newStudents.map((std) => {
        if (std.gender === 'male') image = femaleAvatar;
        if (std.gender === 'female') image = femaleAvatar;

        return (
          <Student
            name={std.name}
            label={std.class_id}
            key={std.name}
            image={std.image || image}
          />
        );
      })}
    </NewIntake>
  );
}

export default NewStudents;
