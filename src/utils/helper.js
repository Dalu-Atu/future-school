// export function addRemarksToResult(grade) {
//   if (grade >= 70) return "EXCELLENT";
//   if (grade >= 60) return "V.GOOD";
//   if (grade >= 50) return "GOOD";
//   if (grade >= 40) return "FAIR";
//   return "FAIL";
// }

//SECONDARY GRADE FUNCTION
// export function addGradeToResult(grade) {
//   let addRemarksToResult;

//   if (grade <= 30) addRemarksToResult = "D";
//   if (grade >= 30 && grade <= 50) addRemarksToResult = "C";
//   if (grade >= 50 && grade <= 70) addRemarksToResult = "B";
//   if (grade >= 70) addRemarksToResult = "A";
//   return addRemarksToResult;
// }

//PRIMARY GRADE FUNCTION

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

/**
 * Formats the position number into an ordinal string (e.g., 1st, 2nd, 3rd, 4th).
 * Note: Duplicate definition removed.
 * @param {number} position - The rank of the student.
 * @returns {string} The formatted ordinal position string.
 */
function getPositionString(position) {
  const lastTwoDigits = position % 100;
  const lastDigit = position % 10;

  // Handles 11th, 12th, 13th
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
      student.averageMark = "0.00";
      return;
    }

    const subjectScores = student.examScores[term];
    
    // Clean up undefined subjects
    Object.keys(subjectScores).forEach((subject) => {
      if (subject === "undefined") {
        delete subjectScores[subject];
      }
    });

    // Calculate total for each subject
    for (const subject in subjectScores) {
      const scores = subjectScores[subject] || {};
      const total =
        (scores.firstTest || 0) + (scores.secondTest || 0) + (scores.exam || 0);
      scores.total = total;
    }

    // Calculate total score
    const totalScore = calculateTotalScore(subjectScores) || 0;
    student.totalScore = totalScore;

    // Calculate average mark
    const numberOfSubjects = Object.keys(subjectScores).length || 1;
    const averageMark = totalScore / numberOfSubjects;

    student.averageMark = averageMark.toFixed(2);
  });

  // Sort students by average mark (Highest average = better position)
  const sortedStudents = students
    .slice()
    .sort((a, b) => parseFloat(b.averageMark) - parseFloat(a.averageMark));

  // Assign positions with tie handling based on average mark
  let currentPosition = 0;
  let previousAverage = null;
  let tieCount = 0;

  sortedStudents.forEach((student, index) => {
    // Use parseFloat because averageMark is stored as a string
    const currentAverage = parseFloat(student.averageMark); 

    if (currentAverage === previousAverage) {
      // Scores are the same, share the position
      tieCount++;
    } else {
      // New score, calculate the actual position
      currentPosition += tieCount + 1;
      tieCount = 0;
    }

    student.position = getPositionString(currentPosition);
    previousAverage = currentAverage;
  });

  return sortedStudents;
}

export function convertClassNames(classNames) {
  const formattedNames = classNames.map((className) => {
    // Split the class name by uppercase letters or digits
    const words = className.match(/[A-Z]+|[0-9]+/g);

    // If there are words, format them
    if (words) {
      return words
        .map((word) => {
          // Capitalize first letter, lowercase the rest
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
    const aSubject = a.subject.toLowerCase();
    const bSubject = b.subject.toLowerCase();

    const aIndex = priorityOrder.indexOf(aSubject);
    const bIndex = priorityOrder.indexOf(bSubject);

    if (aIndex === -1 && bIndex === -1) {
      return 0; // Keep original order if neither is in the list
    } else if (aIndex === -1) {
      return 1; // 'a' (not in list) comes after 'b' (in list)
    } else if (bIndex === -1) {
      return -1; // 'b' (not in list) comes after 'a' (in list)
    } else {
      return aIndex - bIndex; // Compare based on their priority index
    }
  });

  return rearrangedArray;
}

// USE THIS ONE IF NOT THIRD TERM
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
//ONLY FOR THIRD TERM
// export function getStudentPerformanceComment(average) {
//   // Convert to number
//   average = +average;

//   // Handle invalid input
//   if (isNaN(average)) {
//     return "Invalid input. Please provide a valid number.";
//   }

//   // Round to two decimal places
//   const roundedAverage = Math.round(average * 100) / 100;

//   // Determine performance status
//   if (roundedAverage >= 40) {
//     console.log("Promoted");
//     return "Promoted to the Next class";
//   } else {
//     console.log("Failed");
//     return "Failed";
//   }
// }
