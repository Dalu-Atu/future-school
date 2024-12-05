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
  const [attentiveness, setaAttentiveness] = useState(reports?.attentiveness);
  const [creativity, setCreativity] = useState(reports?.creativity);
  const [present, setPresent] = useState(reports?.present);
  const [absent, setAbsent] = useState(reports?.absent);
  const [remarks, setRemarks] = useState(reports?.remarks || "");
  const [principalRemarks, setPrincipalRemark] = useState(
    reports?.principalRemarks || ""
  );

  useEffect(
    function () {
      const comment = getStudentPerformanceComment(formData.averageMark);
      setPoliteness(politeness || 0);
      setNeatness(neatness || 0);
      setaAttentiveness(attentiveness || 0);
      setCreativity(creativity || 0);
      setPresent(present || 0);
      setAbsent(absent || 0);
      setRemarks(remarks || "");

      // Update principal remark and trigger the input change handler
      setPrincipalRemark(comment);
      onInputChange({ target: { name: "principalRemarks", value: comment } });
    },
    [formData.averageMark]
  );
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
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </Select>
      </div>
      <div>
        <Label>Neatness</Label>
        <br />
        <Select
          defaultValue={neatness}
          type="number"
          onChange={onInputChange}
          name="neatness"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </Select>
      </div>

      <div>
        <Label>Attentiveness</Label>
        <br />
        <Select
          defaultValue={attentiveness}
          type="number"
          onChange={onInputChange}
          name="attentiveness"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </Select>
      </div>
      <div>
        <Label>Creativity</Label>
        <br />
        <Select
          defaultValue={creativity}
          type="number"
          onChange={onInputChange}
          name="creativity"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </Select>
      </div>
      <div>
        <Label>No. of time present</Label>
        <br />
        <Input
          defaultValue={present}
          type="number"
          onChange={onInputChange}
          name="present"
        />
      </div>
      <div>
        <Label>No. of time absent</Label>
        <br />
        <Input
          defaultValue={absent}
          type="number"
          onChange={onInputChange}
          name="absent"
        />
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
          defaultValue={principalRemarks}
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
