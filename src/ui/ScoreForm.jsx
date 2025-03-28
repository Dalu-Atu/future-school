import { Input, Label, Select } from "./Form";
import { useState } from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getStudentPerformanceComment } from "../utils/helper";

export const StyledMangeMarksForm = styled.form`
  margin-left: auto;
  margin-right: auto;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  width: 350px;
  padding-left: 2.5rem;
  padding-right: 5rem;
  padding-top: 2rem;
  display: grid;
  gap: 0.7rem;
`;
function ScoreForm({ formData, onInputChange }) {
  const reports = formData.reports;

  const [politeness, setPoliteness] = useState(reports?.politeness || 0);
  const [neatness, setNeatness] = useState(reports?.neatness || 0);
  const [attentiveness, setAttentiveness] = useState(
    reports?.attentiveness || 0
  );
  const [creativity, setCreativity] = useState(reports?.creativity || 0);
  const [present, setPresent] = useState(reports?.present || 0);
  const [absent, setAbsent] = useState(126 - (reports?.present || 0));
  const [remarks, setRemarks] = useState(reports?.remarks || "");
  const [principalRemarks, setPrincipalRemark] = useState(
    reports?.principalRemarks || ""
  );

  // Automatically update absent when present changes
  useEffect(() => {
    const newAbsent = 126 - present;
    setAbsent(newAbsent);
    onInputChange({ target: { name: "absent", value: newAbsent } });
  }, [present]);

  useEffect(() => {
    const comment = getStudentPerformanceComment(formData.averageMark);
    setPrincipalRemark(comment);
    onInputChange({ target: { name: "principalRemarks", value: comment } });
  }, []);

  return (
    <StyledMangeMarksForm>
      <div>
        <Label>Politeness</Label>
        <br />
        <Select
          defaultValue={politeness}
          onChange={onInputChange}
          type="number"
          name="politeness"
        >
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Neatness</Label>
        <br />
        <Select
          defaultValue={neatness}
          onChange={onInputChange}
          type="number"
          name="neatness"
        >
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Attentiveness</Label>
        <br />
        <Select
          defaultValue={attentiveness}
          onChange={onInputChange}
          type="number"
          name="attentiveness"
        >
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Creativity</Label>
        <br />
        <Select
          defaultValue={creativity}
          onChange={onInputChange}
          type="number"
          name="creativity"
        >
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>No. of times present</Label>
        <br />
        <Input
          defaultValue={present}
          type="number"
          onChange={(e) => {
            const sanitizedValue = e.target.value.replace(/^0+/, "") || "0";
            setPresent(parseInt(sanitizedValue, 10));
            onInputChange({
              target: { name: "present", value: sanitizedValue },
            });
          }}
          name="present"
        />
      </div>
      <div>
        <Label>No. of times absent</Label>
        <br />
        <Input value={absent} />
      </div>
      <div>
        <Label>Teacher Remarks</Label>
        <br />
        <Input defaultValue={remarks} onChange={onInputChange} name="remarks" />
      </div>
      <div>
        <Label>Principal Remarks</Label>
        <br />
        <Input
          // onChange={onInputChange}
          value={principalRemarks}
          name="principalRemarks"
        />
      </div>
    </StyledMangeMarksForm>
  );
}
ScoreForm.propTypes = {
  formData: PropTypes.string.isRequired,
  sbjName: PropTypes.string.isRequired,
  onInputChange: PropTypes.string.isRequired,
};
export default ScoreForm;
