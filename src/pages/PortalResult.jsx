import { getDatasetAtEvent } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import Card from "../ui/ReportCard";
import Settings from "../ui/Settings";
import { useSettings } from "../services/settingContext";
import { assignScores } from "../utils/helper";
import { useEffect } from "react";
import { Restricted } from "../features/Users/AddStudentReport";

function PortalResult() {
  const settings = useSettings();
  const location = useLocation();
  const data = location.state;
  let result = "";

  useEffect(() => {
    // Dynamically import Bootstrap CSS when this component loads
    const link = document.createElement("link");
    link.href =
      "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";
    link.rel = "stylesheet";
    link.integrity =
      "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    // Remove the Bootstrap CSS when the component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  let matchingStudent = data.data.matchingStudent;
  const allStudents = data.data.allStudent;

  const toCamelCase = (term) => {
    return term
      .toLowerCase() // Convert to lowercase
      .split(" ") // Split by space
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ) // Capitalize first letter of each word except the first
      .join(""); // Join back to a single string
  };

  const term = toCamelCase(settings.currentTerm);
  const studentResults = assignScores(allStudents, term);

  result = studentResults.find(
    (student) => student.pin === matchingStudent.pin
  );
  matchingStudent = { ...result, ...matchingStudent };

  if (!matchingStudent.hasAccess)
    return (
      <Restricted status="Result not available for now. Contact the school" />
    );

  return (
    <>
      <Card
        formTeacher={matchingStudent.formTeacher}
        data={matchingStudent}
        length={matchingStudent.count}
        term={term}
      />
    </>
  );
}

export default PortalResult;
