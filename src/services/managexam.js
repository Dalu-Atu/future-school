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
  console.log(updatedMarks);

  const { data: allStudents, error } = await supabase
    .from("students")
    .select("id, name, examScores")
    .eq("class_id", stdClass);

  if (error) {
    console.error("Error fetching students:", error.message);
    return { success: false, message: "Failed to fetch students" };
  }

  const updates = [];
  const errors = [];

  for (const std of allStudents) {
    const newSbjDat = updatedMarks.find((student) => student.name === std.name);
    if (!newSbjDat) {
      console.warn(`No updated marks found for student: ${std.name}`);
      continue;
    }

    const updatedExamScores = { ...std.examScores };
    if (!updatedExamScores[currentTerm]) {
      updatedExamScores[currentTerm] = {};
    }
    updatedExamScores[currentTerm][subjectToModify] =
      newSbjDat[subjectToModify];

    updates.push({
      id: std.id,
      examScores: updatedExamScores,
    });
  }

  // Perform updates in bulk (one query per student, but without await inside loop)
  const updatePromises = updates.map((u) =>
    supabase
      .from("students")
      .update({ examScores: u.examScores })
      .eq("id", u.id)
  );

  const results = await Promise.allSettled(updatePromises);

  results.forEach((res, idx) => {
    if (res.status === "rejected" || res.value.error) {
      errors.push({
        studentId: updates[idx].id,
        error: res.reason || res.value.error.message,
      });
    }
  });

  return {
    success: errors.length === 0,
    updated: updates.length - errors.length,
    failed: errors.length,
    errors,
  };
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
