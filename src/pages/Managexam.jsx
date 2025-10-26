import styled from "styled-components";
import { Label, Select } from "../ui/Form";
import Button from "../ui/Button";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getClassess } from "../services/schoolClasses";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import { getSubjectsInClass } from "../services/schoolsbj";
import { useLocation, useNavigate } from "react-router-dom";
import ShowForm from "../ui/ExamScoreForm";
import { FaRobot, FaEdit, FaUpload, FaSpinner } from "react-icons/fa";
import {
  ManageClassAndSubjectScores,
  UpdateMarks,
} from "../services/managexam";
import TranscribeScores from "../services/TranscribeScores";
import { useAuth } from "../services/AuthContext";

const StyledManagexam = styled.div`
  min-height: calc(100vh - 60px);
  padding: 2rem;


  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    color: #718096;
    font-size: 1.1rem;
  }
`;

const StyledManagexamBody = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
`;

const StyledFormGroup = styled.div`
  margin-bottom: 2rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledSelect = styled(Select)`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 3rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #cbd5e0;
  }

  option {
    padding: 0.75rem;
  }
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const StyledButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: large;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(StyledButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const SecondaryButton = styled(StyledButton)`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 90%;
  text-align: center;

  h3 {
    color: #2d3748;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    color: #718096;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 2rem;
  margin: 1.5rem 0;
  background: #f7fafc;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #4299e1;
    background: #ebf8ff;
  }

  &.drag-over {
    border-color: #4299e1;
    background: #ebf8ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #a0aec0;
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const SelectedFile = styled.div`
  background: #e6fffa;
  border: 1px solid #81e6d9;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #234e52;
`;

const ProcessButton = styled(StyledButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

function SelectionBox() {
  const { user } = useAuth();
  const data = useMemo(() => user?.data, [user]);
  console.log(data);

  // Wrap teaches in useMemo to prevent it from changing on every render
  const teaches = useMemo(() => data?.teaches || {}, [data]);
  const teacherClasses = useMemo(() => Object.keys(teaches), [teaches]);
  const isAdmin = useMemo(() => data?.cartegory === "admin", [data]);

  const [term, setTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: saveStudentScores, isPending: isSavingScores } =
    useMutation({
      mutationFn: ({ scores, subject, className, term }) =>
        UpdateMarks(scores, subject, className, term),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [selectedClass, selectedSubject],
        });
        toast.success("Scores successfully added");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to save scores");
      },
    });

  const isFormComplete = term && selectedClass && selectedSubject;

  function handleManageMarks() {
    if (!isFormComplete) {
      toast.error("Please fill in all fields before proceeding");
      return;
    }
    setShowModal(true);
  }

  function handleAIMarks() {
    setShowModal(false);
    setShowUploadModal(true);
  }

  function handleManualMarks() {
    setShowModal(false);
    navigate(
      `/review-score?class=${selectedClass}&subject=${selectedSubject}&term=${term}`
    );
  }

  function handleFileSelect(event) {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 50MB`);
        return false;
      }
      return true;
    });

    setSelectedFile(validFiles.length > 0 ? validFiles : null);
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} image(s) selected`);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    handleFileSelect({ target: { files: event.dataTransfer.files } });
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  async function handleProcessImage() {
    if (!selectedFile) {
      toast.error("Please select an image file first");
      return;
    }

    if (!isFormComplete) {
      toast.error("Please select class, subject, and term first");
      return;
    }

    setIsProcessing(true);

    try {
      const studentData = await ManageClassAndSubjectScores(
        selectedClass,
        selectedSubject,
        term
      );

      if (!studentData || studentData.length === 0) {
        toast.error("No student data found for the selected class and subject");
        return;
      }

      const processedResults = await TranscribeScores(
        selectedFile,
        studentData,
        selectedSubject
      );

      if (!processedResults || processedResults.length === 0) {
        toast.error("Failed to process the image. Try manually");
        return;
      }
      await saveStudentScores({
        scores: processedResults,
        subject: selectedSubject,
        className: selectedClass,
        term: term,
      });

      toast.success("Image processed and scores saved successfully!");
      setShowUploadModal(false);
      navigate(
        `/review-score?class=${selectedClass}&subject=${selectedSubject}&term=${term}`
      );
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(error.message || "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  }

  // Conditionally fetch classes only for admin users
  const {
    isLoading: isGettingClasses,
    data: fetchedClasses = [],
    error: classError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: getClassess,
    enabled: isAdmin, // Only fetch if user is admin
  });

  // Use fetched classes for admin, teacher's classes for non-admin
  const classes = isAdmin ? fetchedClasses : teacherClasses;

  // Only fetch subjects from API if user is admin
  const {
    data: subjectsData,
    isLoading: isGettingSubjects,
    error: subjectsError,
  } = useQuery({
    queryFn: () => getSubjectsInClass(selectedClass),
    queryKey: ["subjects", selectedClass],
    enabled: !!selectedClass && isAdmin, // Only fetch if admin AND class is selected
  });

  // For teachers: set subjects from teaches object when class is selected
  useEffect(() => {
    if (!isAdmin && selectedClass) {
      setSubjects(teaches[selectedClass] || []);
    }
  }, [selectedClass, teaches, isAdmin]);

  // For admins: set subjects from API response
  useEffect(() => {
    if (isAdmin && subjectsData) {
      setSubjects(subjectsData);
    }
  }, [subjectsData, isAdmin]);

  useEffect(() => {
    if (classError || subjectsError) {
      toast.error(classError?.message || subjectsError?.message);
    }
  }, [classError, subjectsError]);

  if ((isAdmin && isGettingClasses) || (isAdmin && isGettingSubjects)) {
    return (
      <LoadingContainer>
        <Spinner size="large" />
      </LoadingContainer>
    );
  }

  return (
    <>
      <StyledManagexamBody>
        <StyledFormGroup>
          <StyledLabel>Select Class</StyledLabel>
          <StyledSelect
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="" disabled>
              Choose a class
            </option>
            {classes.map((cls) => (
              <option value={cls.name || cls} key={cls.name || cls}>
                {cls.name || cls}
              </option>
            ))}
          </StyledSelect>
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Select Term</StyledLabel>
          <StyledSelect value={term} onChange={(e) => setTerm(e.target.value)}>
            <option value="" disabled>
              Choose a term
            </option>
            <option value="firstTerm">First Term</option>
            <option value="secondTerm">Second Term</option>
            <option value="thirdTerm">Third Term</option>
          </StyledSelect>
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Choose Subject</StyledLabel>
          <StyledSelect
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="" disabled>
              {selectedClass
                ? "Choose a subject"
                : "Please select a class first"}
            </option>
            {subjects.map((subject) => (
              <option
                value={subject.subject || subject}
                key={subject.id || subject.subject || subject}
              >
                {subject.subject || subject}
              </option>
            ))}
          </StyledSelect>
        </StyledFormGroup>

        <StyledButtonGroup>
          <PrimaryButton onClick={handleManageMarks} disabled={!isFormComplete}>
            Manage Marks
          </PrimaryButton>
        </StyledButtonGroup>
      </StyledManagexamBody>

      {/* Method Selection Modal */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Choose Marking Method</h3>
            <p>
              Would you like to use AI to automatically scan and input your
              marks, or manually enter marks yourself?
            </p>
            <ModalButtonGroup>
              <SecondaryButton onClick={handleAIMarks}>
                <FaRobot /> Use AI Auto-Fill
              </SecondaryButton>
              <PrimaryButton onClick={handleManualMarks}>
                <FaEdit /> Manual Entry
              </PrimaryButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* File Upload Modal */}
      {showUploadModal && (
        <ModalOverlay onClick={() => setShowUploadModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Upload Student Scores Image</h3>
            <p>
              Please upload an image containing the student scores that you want
              the AI to process and extract.
            </p>

            <FileUploadArea
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <FileInput
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                multiple={true}
              />
              <UploadIcon>
                <FaUpload />
              </UploadIcon>
              <UploadText>
                {selectedFile
                  ? selectedFile.name
                  : "Click to upload or drag and drop"}
              </UploadText>
              <UploadSubtext>Supports JPG, PNG, GIF up to 10MB</UploadSubtext>
            </FileUploadArea>

            {selectedFile && (
              <SelectedFile>
                <FaUpload style={{ color: "#38a169" }} />
                <span>{selectedFile.name}</span>
                <span style={{ marginLeft: "auto", fontSize: "0.9rem" }}>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </SelectedFile>
            )}

            <ProcessButton
              onClick={handleProcessImage}
              disabled={!selectedFile || isProcessing}
            >
              {isProcessing || isSavingScores ? (
                <>
                  <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                  Processing Image...
                </>
              ) : (
                <>
                  <FaRobot />
                  Process with AI
                </>
              )}
            </ProcessButton>
          </ModalContent>
        </ModalOverlay>
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

function Managexam() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const selectedClass = params.get("class");
  const selectedSubject = params.get("subject");
  const selectedTerm = params.get("term");

  if (selectedClass && selectedSubject && selectedTerm) {
    return (
      <ShowForm
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        selectedTerm={selectedTerm}
      />
    );
  }

  return (
    <StyledManagexam>
      <StyledHeader>
        <p>Select class, term, and subject to manage student marks</p>
      </StyledHeader>
      <SelectionBox />
    </StyledManagexam>
  );
}

export default Managexam;
