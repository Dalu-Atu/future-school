import styled from 'styled-components';

const StyledStudent = styled.div`
  margin: 2rem;
  border: 2px solid var(--color-white);
  background-color: var(--color-gray-100);
  box-shadow: -3px 3px 5px var(--color-gray-200),
    3px 3px 5px var(--color-gray-200);
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr 10%;
  padding-right: 5px;
  color: var(--color-gray-500);
`;

function Student({ onClick, image, name, label, id }) {
  return (
    <StyledStudent>
      <div
        style={{
          display: 'flex',
          margin: '1rem',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            // border: '1px solid black',
            overflow: 'hidden',
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            border: '1px solid #fff',
          }}
        >
          <img
            style={{
              // border: '1px solid black',
              overflow: 'hidden',
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
            }}
            src={image}
            alt={image}
          />
        </div>
        <div
          style={{
            position: 'relative',
            left: '10px',
            top: '5px',
          }}
        >
          <p>{name}</p>

          <p style={{ color: '#989da5' }}>{label}</p>
        </div>
      </div>
      <div style={{ fontSize: '25px', position: 'relative', top: '2.5rem' }}>
        {/* {<HiMiniEllipsisHorizontal onClick={() => onClick(id)} />} */}
      </div>
    </StyledStudent>
  );
}

export default Student;
