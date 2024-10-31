import PropTypes from 'prop-types';
import bg from '../assets/bg.png';
import '../styles/result.css';
import {
  addGradeToResult,
  addRemarksToResult,
  generateReportSummary,
} from '../utils/helper';
import { useSettings } from '../services/settingContext';

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
      <td className="font-weight-bold" style={{ textAlign: 'left' }}>
        <b> {subjectName}</b>
      </td>

      <td style={{ textAlign: 'center' }}>{firstTest}</td>
      <td style={{ textAlign: 'center' }}>{secondTest}</td>
      <td>{exam}</td>
      <td>{total}</td>
      {/* <td>{position}</td> */}
      <td>{grade}</td>
      <td>{remark}</td>
    </tr>
  );
}

function Results({ data, length }) {
  const settings = useSettings();

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

  const totalMark = Object.keys(examScores).length * 100;

  const scoresArray = Object.entries(examScores).map(([subject, scores]) => ({
    subject,
    scores,
  }));

  const reportsData = Object.entries(reports).map(([report, value]) => ({
    report,
    value,
  }));

  const summary = generateReportSummary(reportsData);

  return (
    <div className="print-container" style={{ backgroundColor: 'white' }}>
      <div className="container" id="printableArea">
        <div
          className="top_header_content"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="top_header_box">
            <div className="">
              <div className="logo">
                <img src={settings.images.logo} alt="alt" />
              </div>
              <div className="bd_title">
                <h1 className="f20">
                  <strong
                    style={{ backgroundColor: 'yellow', padding: '3px 10px' }}
                  >
                    {settings.schoolName.toUpperCase()}
                  </strong>
                </h1>
                <h4 className="f18">{settings.schoolAdress}</h4>
              </div>
              <div className="bd_photo">
                {/* <img
                  src={image}
                  alt="profile"
                  style={{ border: 'solid 1px black' }}
                /> */}
              </div>
            </div>
            <table className="table" id="tbl_top_1">
              <tbody>
                <tr>
                  <td className="font-weight-bold">Student Name:</td>
                  <td>{name}</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td className="font-weight-bold">Sex:</td>
                  <td>{gender}</td>
                  <td className="font-weight-bold">Class </td>
                  <td>{class_id}</td>
                </tr>
                <tr>
                  <td className="font-weight-bold">Term:</td>
                  <td>{settings.currentTerm}</td>
                  <td className="font-weight-bold">Session:</td>
                  <td>{settings.currentSection}</td>
                </tr>
                <tr>
                  <td className="font-weight-bold">Class Position:</td>
                  <td>{position}</td>
                  <td className="font-weight-bold">Number in Class:</td>
                  <td>{length}</td>
                </tr>
                <tr>
                  <td className="font-weight-bold">Marks Obtained:</td>
                  <td>{marksObtained}</td>
                  <td className="font-weight-bold">Average Marks:</td>
                  <td>{averageMark}</td>
                </tr>
                <tr>
                  <td className="font-weight-bold">Total Marks:</td>
                  <td>{totalMark}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="body_content"
          style={{ backgroundImage: `url(${settings.images.logo})` }}
        >
          <div className="body_txt">
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive1 bd_table1">
                  <table className="table" id="customers">
                    <thead>
                      <tr>
                        <td
                          colSpan="8"
                          style={{
                            backgroundColor: 'yellow',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            borderTop: '1px solid',
                            borderLeft: '1px solid',
                            borderRight: '1px solid',
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: 'yellow',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              borderTop: '1px solid',
                              borderLeft: '1px solid',
                              borderRight: '1px solid',
                            }}
                          >
                            ACADEMIC REPORT
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th
                          scope="col"
                          style={{
                            textAlign: 'center',
                            width: '230px',
                            fontSize: '20px',
                            paddingLeft: '20px',
                          }}
                        >
                          Subject
                        </th>
                        <th scope="col">
                          <p style={{ textAlign: 'center', fontSize: '20px' }}>
                            1st Test
                          </p>
                        </th>
                        <th scope="col">
                          <p style={{ textAlign: 'center', fontSize: '20px' }}>
                            2nd Test
                          </p>
                        </th>
                        <th scope="col">
                          <p style={{ textAlign: 'center', fontSize: '20px' }}>
                            Exam
                          </p>
                        </th>
                        <th scope="col">
                          <p style={{ textAlign: 'center', fontSize: '19px' }}>
                            Obtained Marks
                          </p>
                        </th>
                        <th scope="col">
                          <p style={{ textAlign: 'center', fontSize: '20px' }}>
                            Grade
                          </p>
                        </th>
                        <th scope="col">
                          <p style={{ textAlign: 'center', fontSize: '20px' }}>
                            Remark
                          </p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoresArray.map((sbjScore) => {
                        return (
                          <TableRow
                            key={sbjScore.subject}
                            subjectName={sbjScore.subject || ''}
                            firstTest={sbjScore.scores.firstTest || 0}
                            secondTest={sbjScore.scores.secondTest || 0}
                            exam={sbjScore.scores.exam || 0}
                            total={sbjScore.scores.total || 0}
                            grade={addGradeToResult(sbjScore.scores.total) || 0}
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
                  style={{ marginTop: '10px' }}
                >
                  <table className="table table-bordered padding-0">
                    <tbody>
                      <tr>
                        <td>
                          <div className="bd_key">
                            <strong
                              style={{
                                backgroundColor: '#ffeb3b',
                                padding: '4px 8px',
                                marginBottom: '5px',
                                display: 'block',
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
              </div>
            </div>
            <div className="remarksbox" style={{ padding: '10px 0px' }}>
              <table className="table">
                <tbody>
                  <tr>
                    <th>
                      <p>CLASS TEACHERS REMARK</p>
                    </th>
                    <td colSpan="2">
                      <span style={{ paddingLeft: '5px' }}>
                        {reports.remarks}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <p>PRINCIPALs REMARK</p>
                    </th>
                    <td colSpan="2">{reports.principalRemarks}</td>
                  </tr>
                  <tr>
                    <th>
                      <p>PRINCIPALs NAME</p>
                      <span
                        style={{
                          position: 'relative',
                          top: '-2.2rem',
                          left: '14rem',
                        }}
                      >
                        {settings.principalsName}
                      </span>
                      <br />
                      <p>SCHOOL RESUMES</p>
                      <p>{settings.resumptionDate}</p>
                    </th>
                    <td
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <img
                        style={{
                          position: 'relative',
                          top: '5rem',
                          overflow: 'hidden',
                        }}
                        src={settings.images.stamp}
                        alt="stamp"
                        width="200"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bdftrtop">
              <div className="float-left">
                <span>Seal of the Register</span>
              </div>
              <div className="float-right">
                <span>Date</span>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TableRow.propTypes = {
  subjectName: PropTypes.string.isRequired,
  fitstTest: PropTypes.string.isRequired,
  secondText: PropTypes.string.isRequired,
  exam: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  grade: PropTypes.string.isRequired,
  remark: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
};

Results.propTypes = {
  data: PropTypes.string.isRequired,
  length: PropTypes.string.isRequired,
};
export default Results;
