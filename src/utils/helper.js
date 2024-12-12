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
  const lastTwoDigits = position % 100;
  const lastDigit = position % 10;

  // Special case for 11th, 12th, 13th
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return position + "th";
  }

  // General case for other positions
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
      student.averageMark = "0.00";
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

    // Calculate total and average scores
    const totalScore = calculateTotalScore(student.examScores[term]) || 0;
    student.totalScore = totalScore;

    const averageMark =
      totalScore / Object.keys(student.examScores[term]).length || 0;

    student.averageMark = averageMark.toFixed(2);
  });

  // Sort students by total score
  const sortedStudents = students
    .slice()
    .sort((a, b) => b.totalScore - a.totalScore);

  // Assign positions with tie handling
  let currentPosition = 0;
  let previousScore = null;
  let tieCount = 0;

  sortedStudents.forEach((student, index) => {
    if (student.totalScore === previousScore) {
      // If scores are the same, share the position
      tieCount++;
    } else {
      // New score, calculate the actual position
      currentPosition += tieCount + 1;
      tieCount = 0;
    }

    student.position = getPositionString(currentPosition);
    previousScore = student.totalScore;
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
export function rearrangeSubjects(subjectsArray) {
  // Define a priority order for subjects (all lowercase)
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

  // Sort the array based on the defined priority order
  const rearrangedArray = subjectsArray.sort((a, b) => {
    // Convert subject names to lowercase for case-insensitive comparison
    const aSubject = a.subject.toLowerCase();
    const bSubject = b.subject.toLowerCase();

    const aIndex = priorityOrder.indexOf(aSubject);
    const bIndex = priorityOrder.indexOf(bSubject);

    if (aIndex === -1 && bIndex === -1) {
      // If neither subject is in the priority list, keep original order
      return 0;
    } else if (aIndex === -1) {
      // If 'a' is not in priority list, it should come after 'b'
      return 1;
    } else if (bIndex === -1) {
      // If 'b' is not in priority list, it should come after 'a'
      return -1;
    } else {
      // Otherwise, compare based on their priority order
      return aIndex - bIndex;
    }
  });

  return rearrangedArray;
}
export function getStudentPerformanceComment(average) {
  // Convert to number and round to two decimal places
  average = +average; // Force conversion to number
  if (isNaN(average)) {
    return "Invalid input. Please provide a valid number.";
  }

  // Round to two decimal places
  const roundedAverage = Math.round(average * 100) / 100;

  // Check the condition boundaries
  if (roundedAverage >= 80 && roundedAverage <= 100) {
    console.log("Condition 1: Remarkable and Excellent result");
    return "A Remarkable and Excellent result. Keep it up.";
  } else if (roundedAverage >= 70 && roundedAverage < 80) {
    console.log("Condition 2: Outstanding Performance");
    return "An Outstanding Performance. Keep it up.";
  } else if (roundedAverage >= 60 && roundedAverage < 70) {
    console.log("Condition 3: Brilliant Performance");
    return "A brilliant performance. Keep it up.";
  } else if (roundedAverage >= 50 && roundedAverage < 60) {
    console.log("Condition 4: Very Good Result");
    return "A Very Good Result.";
  } else if (roundedAverage >= 40 && roundedAverage < 50) {
    console.log("Condition 5: Pass");
    return "Pass. Put more effort next term.";
  } else if (roundedAverage >= 20 && roundedAverage < 40) {
    console.log("Condition 6: Poor Performance");
    return "Poor Performance. Put more effort next term.";
  } else if (roundedAverage < 20) {
    console.log("Condition 7: Very Poor Performance");
    return "Very Poor Performance. Put more effort next term.";
  }
  return "No performance data available.";
}
