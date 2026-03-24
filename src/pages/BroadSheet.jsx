import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { fetchStudents } from "../services/schoolStudents";
import Spinner from "../ui/Spinner";
import ChooseClass from "../ui/ChooseClass";
import { useSettings } from "../services/settingContext";
import styled, { createGlobalStyle } from "styled-components";

/* ─── PRINT GLOBALS ─────────────────────────────────────── */
const PrintStyles = createGlobalStyle`
  @page { size: A3 landscape; margin: 10mm 12mm; }
  @media print {
    body * { visibility: hidden; }
    #broadsheet-root, #broadsheet-root * { visibility: visible; }
    #broadsheet-root { position: absolute; top: 0; left: 0; width: 100%; }
    .no-print { display: none !important; }
  }
`;

/* ─── LAYOUT ─────────────────────────────────────────────── */
const PageWrap = styled.div`
  background: #e8ecf2;
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-family: "Segoe UI", sans-serif;
`;

const PrintBtn = styled.button`
  background: #03387e;
  color: #fff;
  border: none;
  padding: 10px 30px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #1a4fa0;
  }
`;

const Sheet = styled.div`
  width: 395mm;
  background: #fff;
  box-shadow: 0 6px 36px rgba(0, 0, 0, 0.18);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const GoldBar = styled.div`
  height: 6px;
  background: linear-gradient(90deg, #b8870f 0%, #e8c84a 50%, #b8870f 100%);
`;

/* ─── HEADER ─────────────────────────────────────────────── */
const Header = styled.div`
  background: #03387e;
  padding: 14px 22px 12px;
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(201, 162, 39, 0.1);
  }
`;

const Emblem = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #c9a227;
  box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
  font-size: 24px;
`;

const HeaderText = styled.div`
  flex: 1;
  z-index: 1;
`;

const SchoolName = styled.h1`
  font-size: 21px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin: 0 0 4px;
  font-family: Georgia, serif;
`;

const SubTitle = styled.p`
  font-size: 10.5px;
  color: #e8c84a;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0;
`;

const MetaGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  z-index: 1;
`;

const Pill = styled.span`
  background: ${(p) => (p.$gold ? "#c9a227" : "rgba(255,255,255,0.12)")};
  border: 1px solid ${(p) => (p.$gold ? "#c9a227" : "rgba(201,162,39,0.45)")};
  color: ${(p) => (p.$gold ? "#021f4a" : "#fff")};
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 3px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const GoldLine = styled.div`
  height: 3px;
  background: linear-gradient(90deg, #b8870f 0%, #e8c84a 50%, #b8870f 100%);
`;

/* ─── TABLE ──────────────────────────────────────────────── */
const TableWrap = styled.div`
  padding: 14px 18px 16px;
  overflow-x: auto;
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 9px;
  font-family: "Segoe UI", sans-serif;
`;

const Th = styled.th`
  background: #03387e;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 6px 5px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  &.name {
    text-align: left;
    min-width: 110px;
  }
  &.sn {
    width: 24px;
  }
  &.gen {
    width: 36px;
  }
  &.total {
    background: #1a4fa0;
    min-width: 36px;
  }
  &.avg {
    background: #1a4fa0;
    min-width: 36px;
  }
  &.pos {
    background: #c9a227;
    color: #021f4a;
    min-width: 34px;
  }
`;

const ThGroup = styled.th`
  background: #021f4a;
  color: #e8c84a;
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 3px 5px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
`;

const Td = styled.td`
  border: 1px solid #d8d8d0;
  padding: 5px 4px;
  text-align: center;
  font-size: 9px;
  vertical-align: middle;
  color: #333;
  background: ${(p) => (p.$alt ? "#eef3fb" : "#fff")};
  &.name {
    text-align: left;
    padding-left: 8px;
    font-weight: 700;
    font-size: 9px;
    color: #111;
    white-space: nowrap;
  }
  &.sn {
    color: #888;
    font-size: 8px;
    font-weight: 700;
  }
  &.gen {
    color: #888;
    font-size: 8px;
  }
  &.total {
    font-weight: 800;
    color: #03387e;
    font-size: 10px;
    background: rgba(3, 56, 126, 0.06) !important;
  }
  &.avg {
    font-weight: 700;
    color: #1a4fa0;
    font-size: 9.5px;
    background: rgba(3, 56, 126, 0.04) !important;
  }
  &.pos {
    font-weight: 900;
    font-size: 10px;
    background: ${(p) =>
      p.$pos === 1
        ? "#c9a227"
        : p.$pos === 2
        ? "#9ea5ad"
        : p.$pos === 3
        ? "#a0522d"
        : "#03387e"} !important;
    color: #fff !important;
  }
  &.hi {
    color: #0a6e3a;
    font-weight: 700;
  }
  &.mid {
    color: #4a4a00;
  }
  &.lo {
    color: #9b1212;
  }
`;

const Tr = styled.tr`
  &:hover td {
    background: #dce8f8 !important;
  }
`;

/* ─── FOOTER ─────────────────────────────────────────────── */
const Footer = styled.div`
  background: #f4f4f0;
  border-top: 2.5px solid #c9a227;
  padding: 10px 22px;
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
`;
const StatVal = styled.span`
  font-size: 18px;
  font-weight: 900;
  color: #03387e;
  font-family: Georgia, serif;
`;
const StatLbl = styled.span`
  font-size: 7.5px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #888;
  font-weight: 700;
`;
const FDiv = styled.div`
  width: 1px;
  height: 32px;
  background: #ccc;
`;
const SignBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;
const SignLine = styled.div`
  width: 110px;
  border-bottom: 1.5px solid #333;
  margin-bottom: 3px;
`;
const SignLbl = styled.span`
  font-size: 7.5px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
`;
const FooterRight = styled.div`
  font-size: 7.5px;
  color: #aaa;
  letter-spacing: 0.8px;
  text-align: right;
  line-height: 1.6;
`;

const BottomBar = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #021f4a 0%, #1a4fa0 50%, #021f4a 100%);
`;

/* ─── HELPERS ────────────────────────────────────────────── */
const EmptyWrap = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 58px);
`;
const EmptyTitle = styled.h2`
  margin: 1rem;
  text-align: center;
  font-weight: 800;
`;

function calcTotal(subjectScores) {
  return Object.values(subjectScores).reduce(
    (sum, { firstTest = 0, secondTest = 0, exam = 0 }) =>
      sum + firstTest + secondTest + exam,
    0
  );
}

function scoreClass(score) {
  if (score >= 75) return "hi";
  if (score >= 50) return "mid";
  return "lo";
}

/* ─── COMPONENT ──────────────────────────────────────────── */
function BroadSheet() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const classStudents = params.get("class");
  const term = params.get("term");
  const { currentTerm, currentSection, schoolName } = useSettings();

  const { data, isLoading } = useQuery({
    queryKey: ["accesspage", classStudents],
    queryFn: () => fetchStudents(classStudents),
    enabled: !!classStudents,
  });

  if (!classStudents)
    return (
      <EmptyWrap>
        <EmptyTitle>View Broadsheet</EmptyTitle>
        <ChooseClass
          redirectRoute="view-broadsheet"
          btnLabel="View Broadsheet"
        />
      </EmptyWrap>
    );

  if (isLoading) return <Spinner size="medium" />;

  /* Build rows */
  const rows = data
    .map((student) => {
      const termScores = student.examScores?.[term] ?? {};
      const total = calcTotal(termScores);
      const subjects = Object.keys(termScores);
      const avg = subjects.length ? (total / subjects.length).toFixed(1) : "—";
      return {
        id: student.id,
        name: student.name,
        gender: student.gender,
        termScores,
        total,
        avg,
      };
    })
    .sort((a, b) => b.total - a.total)
    .map((s, i) => ({ ...s, position: i + 1 }));

  const allSubjects = rows.length ? Object.keys(rows[0].termScores) : [];
  const highestTotal = rows.length ? rows[0].total : 0;
  const classAvg = rows.length
    ? (
        rows.reduce((s, r) => s + parseFloat(r.avg || 0), 0) / rows.length
      ).toFixed(1)
    : "—";
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <PageWrap>
      <PrintStyles />

      {/* Print Button */}
      <PrintBtn className="no-print" onClick={() => window.print()}>
        🖨 Print / Save as PDF
      </PrintBtn>

      {/* Sheet */}
      <Sheet id="broadsheet-root">
        <GoldBar />

        {/* HEADER */}
        <Header>
          <Emblem>
            <img src="./logo.png" alt="" style={{ borderRadius: "50%" }} />
          </Emblem>
          <HeaderText>
            <SchoolName>{schoolName?.toUpperCase()}</SchoolName>
            <SubTitle>
              Academic Broadsheet &nbsp;·&nbsp; {classStudents?.toUpperCase()}{" "}
              &nbsp;·&nbsp; {currentSection}
            </SubTitle>
          </HeaderText>
          <MetaGroup>
            <Pill $gold>{currentTerm}</Pill>
            <Pill>2024 / 2025 Session</Pill>
            <Pill>Printed: {today}</Pill>
          </MetaGroup>
        </Header>
        <GoldLine />

        {/* TABLE */}
        <TableWrap>
          <Table>
            <thead>
              {/* Group label row */}
              <tr>
                <ThGroup colSpan={3} />
                {allSubjects.map((s) => (
                  <ThGroup key={s}>{s}</ThGroup>
                ))}
                <ThGroup colSpan={3}>Summary</ThGroup>
              </tr>
              {/* Column names */}
              <tr>
                <Th className="sn">S/N</Th>
                <Th className="name">Student Name</Th>
                <Th className="gen">Sex</Th>
                {allSubjects.map((s) => (
                  <Th key={s}>
                    {s
                      .split(" ")
                      .map((w) => w[0])
                      .join(".")}
                  </Th>
                ))}
                <Th className="total">Total</Th>
                <Th className="avg">Avg</Th>
                <Th className="pos">Pos</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((student, idx) => {
                const alt = idx % 2 === 1;
                return (
                  <Tr key={student.id}>
                    <Td className="sn" $alt={alt}>
                      {idx + 1}
                    </Td>
                    <Td className="name" $alt={alt}>
                      {student.name.toUpperCase()}
                    </Td>
                    <Td className="gen" $alt={alt}>
                      {student.gender}
                    </Td>
                    {allSubjects.map((subject) => {
                      const sc = student.termScores[subject] ?? {};
                      const total =
                        (sc.firstTest || 0) +
                        (sc.secondTest || 0) +
                        (sc.exam || 0);
                      return (
                        <Td
                          key={subject}
                          className={scoreClass(total)}
                          $alt={alt}
                        >
                          {total}
                        </Td>
                      );
                    })}
                    <Td className="total" $alt={alt}>
                      {student.total}
                    </Td>
                    <Td className="avg" $alt={alt}>
                      {student.avg}
                    </Td>
                    <Td className="pos" $pos={student.position} $alt={alt}>
                      {student.position}
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>

        {/* FOOTER */}
        <Footer>
          <Stat>
            <StatVal>{rows.length}</StatVal>
            <StatLbl>Students</StatLbl>
          </Stat>
          <FDiv />
          <Stat>
            <StatVal>{allSubjects.length}</StatVal>
            <StatLbl>Subjects</StatLbl>
          </Stat>
          <FDiv />
          <Stat>
            <StatVal>{highestTotal}</StatVal>
            <StatLbl>Highest Score</StatLbl>
          </Stat>
          <FDiv />
          <Stat>
            <StatVal>{classAvg}</StatVal>
            <StatLbl>Class Average</StatLbl>
          </Stat>

          <div style={{ flex: 1 }} />

          <SignBlock>
            <SignLine />
            <SignLbl>Class Teacher</SignLbl>
          </SignBlock>
          <SignBlock>
            <SignLine />
            <SignLbl>Head Teacher / Principal</SignLbl>
          </SignBlock>

          <FooterRight>
            CONFIDENTIAL ACADEMIC RECORD
            <br />© {new Date().getFullYear()} {schoolName}
          </FooterRight>
        </Footer>

        <BottomBar />
      </Sheet>
    </PageWrap>
  );
}

export default BroadSheet;
