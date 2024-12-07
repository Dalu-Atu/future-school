import supabase from "./supabase";

export async function ManageClassAndSubjectScores(
  stdClass,
  subject,
  selectedTerm
) {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("class_id", stdClass);

  if (error) {
    if (error) throw new Error("Error fetching students:", error.message);
    console.error("Error fetching students:", error.message);
    return null;
  }

  const students = data
    .map((std) => ({
      image: std.image,
      name: std.name,
      [subject]: std.examScores[selectedTerm][subject],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return students || [];
}

export async function UpdateMarks(
  updatedMarks,
  subjectToModify,
  stdClass,
  currentTerm
) {
  const { data: allStudents, error } = await supabase
    .from("students")
    .select("*")
    .eq("class_id", stdClass);

  if (error) {
    console.error("Error fetching students:", error.message);
    return null;
  }

  // Update marks for each student in the specified term
  const updatedStudents = allStudents.map(async (std) => {
    const newSbjDat = updatedMarks.find((student) => student.name === std.name);

    if (newSbjDat) {
      const updatedExamScores = { ...std.examScores };

      // Ensure the term and subject structures exist before updating
      if (!updatedExamScores[currentTerm]) {
        updatedExamScores[currentTerm] = {};
      }

      updatedExamScores[currentTerm][subjectToModify] =
        newSbjDat[subjectToModify];

      const { data: updatedStudentData, error: updateError } = await supabase
        .from("students")
        .update({ examScores: updatedExamScores })
        .eq("name", std.name)
        .eq("class_id", stdClass);

      if (updateError) {
        console.error(
          `Error updating student ${std.name}:`,
          updateError.message
        );
        throw new Error(`Error updating student ${std.name}`);
      }

      return updatedStudentData;
    } else {
      console.warn(`No updated marks found for student: ${std.name}`);
      return null;
    }
  });

  const results = await Promise.all(updatedStudents);
  return results.filter((result) => result !== null); // Filter out any null results
}

export async function UpdateReports(reports, stdClass) {
  try {
    // Fetch all students in the class
    const { data: allStudents, error } = await supabase
      .from("students")
      .select("*")
      .eq("class_id", stdClass);

    if (error) throw new Error(`Error fetching students: ${error.message}`);

    // Iterate through students and update their reports
    const results = [];
    for (const currStudent of allStudents) {
      const newReport = reports.find(
        (student) => student.name === currStudent.name
      );

      if (newReport) {
        const updatedReport = newReport.reports;

        const { data: updatedStudentData, error: updateError } = await supabase
          .from("students")
          .update({ reports: updatedReport })
          .eq("name", currStudent.name)
          .eq("class_id", stdClass);

        if (updateError) {
          console.error(
            `Error updating report for ${currStudent.name}: ${updateError.message}`
          );
        } else {
          results.push(updatedStudentData);
        }
      } else {
        console.warn(`No updated marks found for student: ${currStudent.name}`);
      }
    }

    // Return the results of all updates
    return results;
  } catch (err) {
    console.error("Error in UpdateReports:", err.message);
    throw err;
  }
}
