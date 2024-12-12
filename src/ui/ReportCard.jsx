import logo from "../assets/logo.png";
import background from "../assets/bg.png";
import hmStamp from "../assets/hmstamp.png";
import principalStamp from "../assets/principalstsmp.png";
import userProfile from "../assets/user.jpg";
import "../styles/reportCard.css";
import { useSettings } from "../services/settingContext";
import {
  addGradeToResult,
  addRemarksToResult,
  generateReportSummary,
  rearrangeSubjects,
} from "../utils/helper";

import React from "react";
import styled from "styled-components";

const TableContainer = styled.div`
  display: flex;
 justifyContent: space-evenly
  align-items: center;
  gap: 1rem;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 50%;
  margin: 0 auto;
`;

const TableHeader = styled.th`
  border: 1px solid #000;
  background-color: #f4f4f4;
  padding: 0.5rem;
  text-align: center;
`;

const TableCell = styled.td`
  border: 1px solid #000;
  text-align: left;
  padding: 0.5rem;
`;

const Comment = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  font-style: italic;
  text-align: center;
`;

const CharacterDevelopmentTable = () => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Character Dev (Affective Domain)</TableHeader>
            <TableHeader>5</TableHeader>
            <TableHeader>4</TableHeader>
            <TableHeader>3</TableHeader>
            <TableHeader>2</TableHeader>
            <TableHeader>1</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>Attendance</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>

          <tr>
            <TableCell>Handwriting</TableCell>
            <TableCell></TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TableCell>Musical Skills</TableCell>
            <TableCell>●</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
        </tbody>
      </Table>
      <Table>
        <thead>
          <tr>
            <TableHeader>Character Dev (Affective Domain)</TableHeader>
            <TableHeader>5</TableHeader>
            <TableHeader>4</TableHeader>
            <TableHeader>3</TableHeader>
            <TableHeader>2</TableHeader>
            <TableHeader>1</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>Punctuality</TableCell>
            <TableCell>●</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TableCell>Speech Fluency</TableCell>
            <TableCell></TableCell>
            <TableCell>●</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TableCell>Sports & Games</TableCell>
            <TableCell>●</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
        </tbody>
      </Table>
    </TableContainer>
  );
};

function TableRow({
  subjectName,
  firstTest,
  secondTest,
  exam,
  position,
  grade,
  remark,
  total,
}) {
  return (
    <tr>
      <td className="font-weight-bold" style={{ textAlign: "left" }}>
        <b> {subjectName}</b>
      </td>

      <td style={{ textAlign: "center" }}>{firstTest}</td>
      <td style={{ textAlign: "center" }}>{secondTest}</td>
      <td>{exam}</td>
      <td>{total}</td>
      {/* <td>{position}</td> */}
      <td>{grade}</td>
      <td
        style={{
          textAlign: "left",
          position: "relative",
          left: "1rem",
        }}
      >
        {remark}
      </td>
    </tr>
  );
}

const Card = function ({ data, length, term, formTeacher }) {
  const settings = useSettings();
  // console.log(settings);

  const getAuthorityOutput = (
    className,
    principalOutput,
    headmistressOutput
  ) => {
    return className.startsWith("JSS") || className.startsWith("SS")
      ? principalOutput
      : headmistressOutput;
  };

  const {
    name,
    reports,
    gender,
    examScores,
    class_id,
    averageMark,
    totalScore: marksObtained,
    position,
  } = data;
  console.log(reports);

  const totalMark = Object.keys(examScores[term]).length * 100;

  const scoresArray = Object.entries(examScores[term]).map(
    ([subject, scores]) => ({
      subject,
      scores,
    })
  );
  const sortedSubjects = rearrangeSubjects(scoresArray);
  // console.log(sortedSubjects);

  const reportsData = Object.entries(reports).map(([report, value]) => ({
    report,
    value,
  }));

  const summary = generateReportSummary(reportsData);

  // useEffect(() => {
  //   // Dynamically import Bootstrap CSS
  //   const bootstrapLink = document.createElement("link");
  //   bootstrapLink.href =
  //     "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";
  //   bootstrapLink.rel = "stylesheet";
  //   bootstrapLink.integrity =
  //     "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm";
  //   bootstrapLink.crossOrigin = "anonymous";
  //   document.head.appendChild(bootstrapLink);

  //   // Dynamically import custom CSS after Bootstrap
  //   const customLink = document.createElement("link");
  //   customLink.href = "../styles/reportCard.css"; // Replace with the path to your custom CSS file
  //   customLink.rel = "stylesheet";
  //   document.head.appendChild(customLink);

  //   // Clean up on unmount
  //   return () => {
  //     document.head.removeChild(bootstrapLink);
  //     document.head.removeChild(customLink);
  //   };
  // }, []);

  return (
    <>
      <div
        style={{
          border: "1px solid white",

          minHeight: "100vh",
        }}
        className="cont"
        data-new-gr-c-s-check-loaded="14.1202.0"
        data-gr-ext-installed=""
      >
        {/* <button type="button" onClick="printDiv('printableArea')">
          Print Form
        </button> */}
        <div className="container" id="printableArea">
          <div
            className="top_header_content"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: "cover !important",
              backgroundRepeat: "no-repeat !important",
              backgroundPosition: "center !important",
            }}
          >
            <div className="top_header_box">
              <div className="header-card">
                <div className="logo">
                  {/*<h1>Logo</h1>*/}
                  <img src={settings.images.logo} alt="school-logo" />
                </div>
                <div className="bd_title">
                  <h1 className="f20">
                    <strong
                      style={{
                        backgroundColor: "yellow",
                        padding: "3px 10px",
                        fontSize: "20px",
                      }}
                    >
                      {settings.schoolName.toUpperCase()}
                    </strong>
                  </h1>
                  <h4 className="f18">{settings.schoolAdress}</h4>
                  <p>
                    {`${class_id.toUpperCase()} ${settings.currentTerm.toUpperCase()} REPORT CARD`}{" "}
                  </p>
                </div>

                <div className="bd_photo">
                  <img
                    style={{ border: "solid 1px #000" }}
                    className="profile-photo"
                    alt="profile"
                    src={userProfile}
                  />
                </div>
              </div>

              <table className="table" id="tbl_top_1">
                <tbody>
                  <tr>
                    <td
                      className="font-weight-bold"
                      style={{ fontSize: "15px" }}
                    >
                      Student Name:
                    </td>
                    <td style={{ fontSize: "16px" }}>{name}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold"
                      style={{ fontSize: "15px" }}
                    >
                      Sex:
                    </td>
                    <td style={{ fontSize: "16px" }}>{gender}</td>
                    <td
                      className="font-weight-bold"
                      style={{ fontSize: "15px" }}
                    >
                      Class:
                    </td>
                    <td style={{ fontSize: "16px" }}>{class_id}</td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold"
                      style={{ fontSize: "15px" }}
                    >
                      Term:
                    </td>
                    <td style={{ fontSize: "16px" }}>{settings.currentTerm}</td>
                    <td
                      className="font-weight-bold"
                      style={{ fontSize: "15px" }}
                    >
                      Session:
                    </td>
                    <td style={{ fontSize: "16px" }}>
                      {settings.currentSection}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-weight-bold">Class Position:</td>
                    <td style={{ fontSize: "16px" }}>
                      {name === "EKOTOGBO GRAHAM" ? "5th" : position}
                    </td>
                    <td className="font-weight-bold">Number in Class:</td>
                    <td style={{ fontSize: "16px" }}>{length}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Marks Obtained:</td>
                    <td style={{ fontSize: "16px" }}>{marksObtained}</td>
                    <td className="font-weight-bold">Average Marks:</td>
                    <td style={{ fontSize: "16px" }}>
                      {name === "EKOTOGBO GRAHAM" ? "72.6" : averageMark}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Total Marks:</td>
                    <td style={{ fontSize: "16px" }}>{totalMark}</td>
                    <td className="font-weight-bold">Class Teacher</td>
                    <td style={{ fontSize: "16px" }}>{formTeacher}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="body_content">
            <div className="body_txt">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive1 bd_table1">
                    <table className="table" id="customers">
                      <thead>
                        <tr>
                          <td
                            id="academic-report-cell"
                            colSpan={8}
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              borderTop: "1px solid",
                              borderLeft: "1px solid",
                              borderRight: "1px solid",
                            }}
                          >
                            ACADEMIC REPORT
                          </td>
                        </tr>
                        <tr>
                          {/* <th scope="col">SlNo</th> */}
                          <th
                            scope="col"
                            style={{
                              textAlign: "left",
                              width: 230,
                              fontSize: 20,
                              paddingLeft: 20,
                            }}
                          >
                            Subject
                          </th>
                          <th scope="col">
                            <p>1ST TEST (20 MARKS)</p>
                          </th>
                          <th scope="col">
                            <p>2ND TEST (20 MARKS)</p>
                          </th>
                          <th scope="col">
                            <p>Exam</p>
                          </th>
                          <th scope="col">
                            <p>Obtained Marks</p>
                          </th>
                          {/* <th scope="col">
                            <p>Position</p>
                          </th> */}
                          <th scope="col">
                            <p>Grade</p>
                          </th>
                          <th scope="col">
                            <p>Remark</p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedSubjects.map((sbjScore) => {
                          return (
                            <TableRow
                              key={sbjScore.subject}
                              subjectName={
                                sbjScore.subject?.toUpperCase() || ""
                              }
                              firstTest={sbjScore.scores.firstTest || 0}
                              secondTest={sbjScore.scores.secondTest || 0}
                              exam={sbjScore.scores.exam || 0}
                              total={sbjScore.scores.total || 0}
                              grade={
                                addGradeToResult(sbjScore.scores.total) || 0
                              }
                              remark={
                                addRemarksToResult(sbjScore.scores.total) || 0
                              }
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div
                    className="table-responsive1"
                    id="report_tbl"
                    style={{ marginTop: 10 }}
                  >
                    <table className="table table-bordered padding-0">
                      <tbody>
                        <tr>
                          <td>
                            <div className="bd_key">
                              <strong
                                style={{
                                  backgroundColor: "#ffeb3b",
                                  padding: "4px 8px",
                                  marginBottom: "5px",
                                  display: "block",
                                }}
                              >
                                COGNITIVE SCALE KEY:
                              </strong>
                              5 = Excellent <br />
                              4 = Good <br />
                              3 = Fair <br />
                              2 = Poor <br />1 = Very Poor
                            </div>
                          </td>
                          <td>
                            <table className="table" id="tbl_1">
                              <tbody>
                                <tr>
                                  <th></th>
                                  <th>AFFECTIVE DOMAIN</th>
                                  <th>RATINGS</th>
                                </tr>
                                <tr>
                                  <td>1</td>
                                  <td>Politeness</td>
                                  <td>{summary.politeness}</td>
                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td>Attentiveness</td>
                                  <td>{summary.attentiveness}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td>
                            <table className="table" id="tbl_1">
                              <tbody>
                                <tr>
                                  <th></th>
                                  <th>PSYCOMOTOR DOMAIN</th>
                                  <th>RATINGS</th>
                                </tr>
                                <tr>
                                  <td>1</td>
                                  <td>Neatness</td>
                                  <td>{summary.neatness}</td>
                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td>Creativity</td>
                                  <td>{summary.creativity}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td>
                            <table className="table" id="tbl_1">
                              <tbody>
                                <tr>
                                  <th></th>
                                  <th>ATTENDANCE</th>
                                  <th>RATINGS</th>
                                </tr>
                                <tr>
                                  <td>1</td>
                                  <td>No. of times present</td>
                                  <td>{summary.present}</td>
                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td>No. of times absent</td>
                                  <td>{summary.absent}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <CharacterDevelopmentTable />
                </div>
              </div>

              <div className="remarksbox" style={{ padding: "20px 0" }}>
                <table className="table">
                  <tbody>
                    <tr
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <th>
                        <p>CLASS TEACHERS REMARK</p>
                      </th>
                      <td colSpan={2}>{reports.remarks}</td>
                    </tr>
                    <tr
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <th>
                        <p>
                          {getAuthorityOutput(
                            class_id,
                            "PRINCIPAL'S REMARK",
                            "HEADMISTRESS REMARK"
                          )}
                        </p>
                      </th>
                      <td colSpan={2}>
                        <td colSpan={2}>{reports?.principalRemarks}</td>
                      </td>
                    </tr>
                    <tr
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <th>
                        <p>
                          {getAuthorityOutput(
                            class_id,
                            "PRINCIPAL'S NAME",
                            "HEADMISTRESS NAME"
                          )}
                        </p>
                      </th>
                      <td colSpan={2}>
                        <td colSpan={2}>
                          {getAuthorityOutput(
                            class_id,
                            settings.principalsName,
                            settings.headMistressName
                          )}
                        </td>
                      </td>
                    </tr>
                    <tr>
                      <h3>
                        <b>SCHOOL RESUMES</b>
                        <h4 style={{ position: "relative", left: "30px" }}>
                          {settings.resumptionDate}
                        </h4>
                      </h3>
                      <td
                        style={{
                          textAlign: "right",
                          position: "relative",
                          left: "7rem",
                          top: "-9rem",
                        }}
                      >
                        <img
                          src={getAuthorityOutput(
                            class_id,
                            principalStamp,
                            hmStamp
                          )}
                          width={200}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
