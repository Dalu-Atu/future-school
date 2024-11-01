export function addRemarksToResult(grade) {
  let addRemarksToResult;

  if (grade <= 30) addRemarksToResult = "POOR";
  if (grade >= 30 && grade <= 50) addRemarksToResult = "GOOD";
  if (grade >= 50 && grade <= 70) addRemarksToResult = "VERY GOOD";
  if (grade >= 70) addRemarksToResult = "EXCELLENT";
  return addRemarksToResult;
}

export function addGradeToResult(grade) {
  let addRemarksToResult;

  if (grade <= 30) addRemarksToResult = "D";
  if (grade >= 30 && grade <= 50) addRemarksToResult = "C";
  if (grade >= 50 && grade <= 70) addRemarksToResult = "B";
  if (grade >= 70) addRemarksToResult = "A";
  return addRemarksToResult;
}

export function generateReportSummary(reports) {
  const reportSummary = {};

  // Define mappings
  const valueMappings = {
    0: "GOOD",
    1: "POOR",
    2: "VERY POOR",
    3: "FAIR",
    4: "VERY GOOD",
    5: "EXCELLENT",
  };

  // Loop through the reports
  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];
    const reportName = report.report;
    const reportValue = report.value;

    // Check if the report value exists in the mappings
    if (typeof reportValue === "number") {
      if (reportName !== "absent" && reportName !== "present") {
        if (valueMappings[reportValue]) {
          reportSummary[reportName] = valueMappings[reportValue];
        }
      } else {
        reportSummary[reportName] = reportValue;
      }
    } else {
      // If it's a string, assign it directly
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
        // Avoid including 'total' in the sum
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
        // Avoid including 'total' in the average calculation
        totalScore += scores[scoreType];
        scoreCount++;
      }
    }
  }
  if (scoreCount === 0) return 0; // Avoid division by zero
  return totalScore / scoreCount;
}

function getPositionString(position) {
  const suffixes = ["st", "nd", "rd"];
  const suffix = position > 3 ? "th" : suffixes[position - 1] || suffixes[2];
  return position + suffix;
}

export function assignScores(students, term) {
  console.log(students, term);

  students?.forEach((student) => {
    // Calculate total and add to each subject's scores
    for (const subject in student.examScores[term]) {
      const scores = student.examScores[term][subject];
      console.log(scores);

      const total =
        (scores.firstTest || 0) + (scores.secondTest || 0) + (scores.exam || 0);
      scores.total = total;
    }

    // Calculate total score for the student
    const totalScore = calculateTotalScore(student.examScores[term]);
    student.totalScore = totalScore;

    // Calculate average mark for the student
    const averageMark = calculateAverageMark(student.examScores[term]);
    student.averageMark = averageMark.toFixed(2);
  });

  // Sort students by total score in descending order
  const sortedStudents = students
    .slice()
    .sort((a, b) => b.totalScore - a.totalScore);

  // Assign positions
  sortedStudents.forEach((student, index) => {
    student.position = getPositionString(index + 1);
  });

  return sortedStudents;
}

export function convertClassNames(classNames) {
  const formattedNames = classNames.map((className) => {
    // Split the class name by uppercase letters or digits
    const words = className.match(/[A-Z]+|[0-9]+/g);

    // If there are words, format them as required
    if (words) {
      return words
        .map((word) => {
          // Convert the first character to uppercase and the rest to lowercase
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" "); // Join the words with a space
    } else {
      return className; // Return the original className if no words are found
    }
  });

  return formattedNames.join(" and "); // Join the formatted names with 'and'
}
