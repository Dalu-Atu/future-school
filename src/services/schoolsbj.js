import supabase from "./supabase";
import { fetchStudents } from "./schoolStudents";

export async function addOrUpdateAssignedSubject(data) {
  const { subjectToAssign, selectedSubject: previousSubjectData } = data;
  const { subjectTeacher, className, subjectName, isFormTeacher } =
    subjectToAssign;

  // Fetch current teacher data
  const { data: currentTeacherData, error: currentTeacherError } =
    await supabase
      .from("teachers")
      .select("teaches, isFormTeacher")
      .eq("name", subjectTeacher)
      .single();

  if (currentTeacherError) throw new Error("Error fetching current teacher");

  // If subjectTeacher has changed, update previous teacher's teaches field
  if (subjectTeacher !== previousSubjectData.name) {
    const { data: previousTeacherData, error: previousTeacherError } =
      await supabase
        .from("teachers")
        .select("teaches")
        .eq("name", previousSubjectData.name)
        .single();

    if (previousTeacherError)
      throw new Error("Error fetching previous teacher");

    const previousTeacher = previousTeacherData;
    if (previousTeacher) {
      let previousTeaches = previousTeacher.teaches || {};
      if (previousTeaches[className]) {
        previousTeaches[className] = previousTeaches[className].filter(
          (subj) => subj !== previousSubjectData.subject
        );
        if (previousTeaches[className].length === 0) {
          delete previousTeaches[className];
        }

        const { error: previousUpdateError } = await supabase
          .from("teachers")
          .update({ teaches: previousTeaches })
          .eq("name", previousSubjectData.name);

        if (previousUpdateError)
          throw new Error("Error updating previous teacher");
      }
    }
  }

  // Update the current teacher's teaches field
  if (currentTeacherData) {
    let currentTeaches = currentTeacherData.teaches || {};
    currentTeaches[className] = currentTeaches[className] || [];

    // Remove previous subject if it differs from the new one
    if (previousSubjectData.subject !== subjectName) {
      currentTeaches[className] = currentTeaches[className].filter(
        (sbj) => sbj !== previousSubjectData.subject
      );
    }

    // Add the new subject (ensure uniqueness)
    currentTeaches[className] = Array.from(
      new Set([...currentTeaches[className], subjectName])
    );

    const updateFields = {
      teaches: currentTeaches,
      ...(isFormTeacher === "yes" ? { isFormTeacher: [className] } : {}),
    };

    const { error: currentUpdateError } = await supabase
      .from("teachers")
      .update(updateFields)
      .eq("name", subjectTeacher);

    if (currentUpdateError) throw new Error("Error updating current teacher");
  }

  // Fetch students in the class
  const studentsInClass = await fetchStudents(className);

  // Prepare batch updates for students
  const studentUpdates = studentsInClass.map((student) => {
    // Initialize examScores if not defined or if empty
    const examScores = student.examScores || {
      firstTerm: {},
      secondTerm: {},
      thirdTerm: {},
    };

    // Ensure each term is initialized
    ["firstTerm", "secondTerm", "thirdTerm"].forEach((term) => {
      if (!examScores[term]) {
        examScores[term] = {};
      }

      // Rename subject if it exists in each term
      if (previousSubjectData.subject !== subjectName) {
        examScores[term][subjectName] =
          examScores[term][previousSubjectData.subject];
        delete examScores[term][previousSubjectData.subject];
      }
    });

    return supabase
      .from("students")
      .update({ examScores })
      .eq("id", student.id);
  });

  // Perform all student updates in parallel
  const updateResults = await Promise.all(studentUpdates);

  // Check for errors in batch updates
  for (const result of updateResults) {
    if (result.error) {
      console.error("Error updating student:", result.error.message);
      throw new Error("Error updating students");
    }
  }

  return { message: "Subject assigned and exam scores updated successfully" };
}

// Function to get all subjects in a particular class with their assigned teacher
export async function getSubjectsInClass(className) {
  const { data, error } = await supabase.from("teachers").select("*");

  if (error) throw new Error("Error fetching teachers:", error);

  const result = [];
  data.forEach((teacher) => {
    let isForm = "No";

    //if the class name is in the isFormTeacher field, form teacher in the ui should be yes
    if (teacher?.isFormTeacher?.includes(className)) isForm = "Yes";

    if (teacher.teaches && teacher.teaches[className]) {
      teacher.teaches[className].forEach((subject) => {
        result.push({
          name: teacher.name,
          className,
          subject,
          isFormTeacher: isForm,
        });
      });
    }
  });
  return result;
}

export async function addAsignSubject(subjectToAssign) {
  const { subjectTeacher, className, subjectName, isFormTeacher } =
    subjectToAssign;

  if (!subjectTeacher || !className || !subjectName || !isFormTeacher) {
    throw new Error("Please fill all fields");
  }

  // Fetch students in the specified class
  const studentInClass = await fetchStudents(className);
  if (!studentInClass.length) {
    throw new Error("No students found in the specified class.");
  }

  // Fetch teacher data
  const { data: teacherData, error: teacherError } = await supabase
    .from("teachers")
    .select("teaches, isFormTeacher")
    .eq("name", subjectTeacher)
    .single();

  if (teacherError) {
    console.error("Error fetching teacher:", teacherError.message);
    throw new Error("Error fetching teacher");
  }

  // Update teacher's `teaches` field
  if (teacherData) {
    let teaches = teacherData.teaches || {};
    teaches[className] = teaches[className] || [];

    if (teaches[className].includes(subjectName)) {
      throw new Error("Subject already exists for this teacher");
    }

    teaches[className].push(subjectName);

    const updateFields = { teaches };
    if (isFormTeacher === "yes") {
      updateFields.isFormTeacher = [className];
    }

    const { error: updateTeacherError } = await supabase
      .from("teachers")
      .update(updateFields)
      .eq("name", subjectTeacher);

    if (updateTeacherError) {
      console.error("Error updating teacher:", updateTeacherError.message);
      throw new Error("Error updating teacher");
    }
  }

  // Default structure for new subject scores
  const defaultSubjectScores = {
    [subjectName]: {
      firstTest: 0,
      secondTest: 0,
      exam: 0,
    },
  };

  // Prepare all updates for students
  const updatedStudents = studentInClass.map((student) => {
    const examScores = student.examScores || {
      firstTerm: {},
      secondTerm: {},
      thirdTerm: {},
    };
    examScores.firstTerm = examScores.firstTerm || {};
    examScores.secondTerm = examScores.secondTerm || {};
    examScores.thirdTerm = examScores.thirdTerm || {};
    // Check if the subject already exists in any term
    if (
      examScores.firstTerm[subjectName] !== undefined ||
      examScores.secondTerm[subjectName] !== undefined ||
      examScores.thirdTerm[subjectName] !== undefined
    ) {
      throw new Error(`Subject ${subjectName} already exists for this class`);
    }

    // Update examScores for each term
    examScores.firstTerm = { ...examScores.firstTerm, ...defaultSubjectScores };
    examScores.secondTerm = {
      ...examScores.secondTerm,
      ...defaultSubjectScores,
    };
    examScores.thirdTerm = { ...examScores.thirdTerm, ...defaultSubjectScores };

    return { id: student.id, examScores }; // Structure the data for upsert
  });

  // Batch update students' examScores
  const { error: updateError } = await supabase
    .from("students")
    .upsert(updatedStudents, { onConflict: ["id"] }); // Use upsert to update records in bulk

  if (updateError) {
    console.error("Error updating students:", updateError.message);
    throw new Error("Error updating students");
  }

  return { message: "Subject assigned and exam scores updated successfully" };
}

export async function deleteSubject(subjectToDelete) {
  const { name, className, subject } = subjectToDelete;

  // Fetch the teacher data
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("name", name);

  if (error) throw new Error("Error fetching previous teacher");

  const teacher = data[0];
  if (teacher) {
    let previousTeaches = teacher.teaches || {};

    if (previousTeaches[className]) {
      // Remove the subject from the teacher's class list
      previousTeaches[className] = previousTeaches[className].filter(
        (subj) => subj !== subject
      );

      // Delete the class if no subjects are left
      if (previousTeaches[className].length === 0) {
        delete previousTeaches[className];
      }

      const { error: previousUpdateError } = await supabase
        .from("teachers")
        .update({ teaches: previousTeaches })
        .eq("name", teacher.name);

      if (previousUpdateError)
        throw new Error("Error updating previous teacher");
    }
  }

  // Fetch students in the specified class
  const studentsInClass = await fetchStudents(className);

  // Prepare updates for all students in a single batch operation
  const updatedStudents = studentsInClass.map((student) => {
    const examScores = student.examScores || {
      firstTerm: {},
      secondTerm: {},
      thirdTerm: {},
    };

    // Delete the subject from each term if it exists
    ["firstTerm", "secondTerm", "thirdTerm"].forEach((term) => {
      if (examScores[term] && examScores[term][subject]) {
        delete examScores[term][subject];
      }
    });

    return { id: student.id, examScores }; // Structure data for batch update
  });

  // Batch update all students' examScores
  const { error: updateError } = await supabase
    .from("students")
    .upsert(updatedStudents, { onConflict: ["id"] });

  if (updateError) {
    console.error("Error updating students:", updateError.message);
    throw new Error("Error updating students");
  }

  return {
    message:
      "Subject deleted and exam scores updated successfully across all terms",
  };
}
// export async function deleteSubject() {
//   try {
//     // Fetch all students to get their IDs
//     const { data: students, error: fetchError } = await supabase
//       .from("students")
//       .select("id"); // Only fetch the IDs

//     if (fetchError) {
//       console.error("Error fetching students:", fetchError.message);
//       return;
//     }

//     // Define batch size
//     const batchSize = 50; // Adjust batch size if needed
//     for (let i = 0; i < students.length; i += batchSize) {
//       // Create a batch of students
//       const batch = students.slice(i, i + batchSize);
//       const batchIds = batch.map((student) => student.id);

//       // Update examScores for the current batch
//       const { error: batchError } = await supabase
//         .from("students")
//         .update({ examScores: {} })
//         .in("id", batchIds); // Use 'in' to update only the students in the batch

//       if (batchError) {
//         console.error("Error updating batch:", batchError.message);
//       } else {
//         console.log(`Updated examScores for batch ${i / batchSize + 1}`);
//       }
//     }

//     console.log("Successfully updated examScores for all students.");
//   } catch (err) {
//     console.error("Unexpected error:", err);
//   }
// }
