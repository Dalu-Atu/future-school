export function addRemarksToResult(grade) {
  if (grade >= 70) return "EXCELLENT";
  if (grade >= 60 && grade <= 69) return "V. GOOD";
  if (grade >= 50 && grade <= 59) return "GOOD";
  if (grade >= 40 && grade <= 49) return "FAIR";
  if (grade >= 30 && grade <= 39) return "FAIL";
  return "FAIL";
}


export function addGradeToResult(grade) {
  if (grade >= 70) return "A";
  if (grade >= 60 && grade <= 69) return "B";
  if (grade >= 50 && grade <= 59) return "C";
  if (grade >= 40 && grade <= 49) return "D";
  if (grade >= 30 && grade <= 39) return "E";
  return "E";
}

export function generateReportSummary(reports) {
  const reportSummary = {};

  const valueMappings = {
    0: "GOOD",
    1: "POOR",
    2: "VERY POOR",
    3: "FAIR",
    4: "VERY GOOD",
    5: "EXCELLENT",
  };

  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];
    const reportName = report.report;
    const reportValue = report.value;

    if (typeof reportValue === "number") {
      if (reportName !== "absent" && reportName !== "present") {
        if (valueMappings[reportValue]) {
          reportSummary[reportName] = valueMappings[reportValue];
        }
      } else {
        reportSummary[reportName] = reportValue;
      }
    } else {
      reportSummary[reportName] = reportValue;
    }
  }

  return reportSummary;
}

function calculateTotalScore(examScores) {
  let totalScore = 0;
  for (const subject in examScores) {
    const scores = examScores[subject];
    for (const scoreType in scores) {
      if (scoreType !== "total") {
        totalScore += scores[scoreType];
      }
    }
  }
  return totalScore;
}

function calculateAverageMark(examScores) {
  let totalScore = 0;
  let scoreCount = 0;
  for (const subject in examScores) {
    const scores = examScores[subject];
    for (const scoreType in scores) {
      if (scoreType !== "total") {
        totalScore += scores[scoreType];
        scoreCount++;
      }
    }
  }
  if (scoreCount === 0) return 0;
  return totalScore / scoreCount;
}

function getPositionString(position) {
  const lastTwoDigits = position % 100;
  const lastDigit = position % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return position + "th";
  }

  const suffixes = { 1: "st", 2: "nd", 3: "rd" };
  const suffix = suffixes[lastDigit] || "th";

  return position + suffix;
}

export function assignScores(students, term) {
  if (!students || !Array.isArray(students)) return [];

  students.forEach((student) => {
    if (!student.examScores || !student.examScores[term]) {
      console.warn(`Invalid exam scores for student: ${student.name}`);
      student.totalScore = 0;
      student.averageMark = 0;
      return;
    }

    // Remove subjects named 'undefined'
    Object.keys(student.examScores[term]).forEach((subject) => {
      if (subject === "undefined") {
        delete student.examScores[term][subject];
      }
    });

    // Calculate total for each subject
    for (const subject in student.examScores[term]) {
      const scores = student.examScores[term][subject] || {};
      const total =
        (scores.firstTest || 0) + (scores.secondTest || 0) + (scores.exam || 0);
      scores.total = total;
    }

    // Calculate total score
    const totalScore = calculateTotalScore(student.examScores[term]) || 0;
    student.totalScore = totalScore;

    // Calculate averageMark by dividing totalScore by number of subjects
    const numberOfSubjects = Object.keys(student.examScores[term]).length || 1;
    const averageMark = parseFloat((totalScore / numberOfSubjects).toFixed(2));

    student.averageMark = averageMark; // stored as a number, not a string
  });

  // Sort students by averageMark (highest to lowest)
  const sortedStudents = students
    .slice()
    .sort((a, b) => b.averageMark - a.averageMark);

  // Assign positions with tie handling based on averageMark
  let currentPosition = 0;
  let previousAverage = null;
  let tieCount = 0;

  sortedStudents.forEach((student) => {
    if (student.averageMark === previousAverage) {
      // Same average — share the position
      tieCount++;
    } else {
      // New average — advance position
      currentPosition += tieCount + 1;
      tieCount = 0;
    }

    student.position = getPositionString(currentPosition);
    previousAverage = student.averageMark;
  });

  return sortedStudents;
}

export function convertClassNames(classNames) {
  const formattedNames = classNames.map((className) => {
    const words = className.match(/[A-Z]+|[0-9]+/g);

    if (words) {
      return words
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    } else {
      return className;
    }
  });

  return formattedNames.join(" and ");
}

export function rearrangeSubjects(subjectsArray) {
  const priorityOrder = [
    "mathematics",
    "english studies",
    "physics",
    "chemistry",
    "biology",
    "geography",
    "literature",
    "basic tech",
    "basic science",
    "agric science",
    "home economics",
    "ict",
    "number work",
    "letter work",
    "health habit",
    "social habit",
    "rhymes",
    "penmanship",
    "phonics",
  ];

  const rearrangedArray = subjectsArray.sort((a, b) => {
    const aSubject = a.subject.toLowerCase();
    const bSubject = b.subject.toLowerCase();

    const aIndex = priorityOrder.indexOf(aSubject);
    const bIndex = priorityOrder.indexOf(bSubject);

    if (aIndex === -1 && bIndex === -1) return 0;
    else if (aIndex === -1) return 1;
    else if (bIndex === -1) return -1;
    else return aIndex - bIndex;
  });

  return rearrangedArray;
}

export function getStudentPerformanceComment(average) {
  average = +average;
  if (isNaN(average)) {
    return "Invalid input. Please provide a valid number.";
  }

  const roundedAverage = Math.round(average * 100) / 100;

  if (roundedAverage >= 80 && roundedAverage <= 100) {
    return "A Remarkable and Excellent result. Keep it up.";
  } else if (roundedAverage >= 70 && roundedAverage < 80) {
    return "An Outstanding Performance. Keep it up.";
  } else if (roundedAverage >= 60 && roundedAverage < 70) {
    return "A brilliant performance. Keep it up.";
  } else if (roundedAverage >= 50 && roundedAverage < 60) {
    return "A Very Good Result.";
  } else if (roundedAverage >= 40 && roundedAverage < 50) {
    return "Pass. Put more effort next term.";
  } else if (roundedAverage >= 20 && roundedAverage < 40) {
    return "Poor Performance. Put more effort next term.";
  } else if (roundedAverage < 20) {
    return "Very Poor Performance. Put more effort next term.";
  }
  return "No performance data available.";
}
