import supabase from "./supabase";
import { fetchStudents } from "./schoolStudents";

export async function addOrUpdateAssignedSubject(data) {
  const { subjectToAssign, selectedSubject: PreviousSubjectData } = data;
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
  if (subjectTeacher !== PreviousSubjectData.name) {
    const { data: previousTeacherData, error: previousTeacherError } =
      await supabase
        .from("teachers")
        .select("teaches")
        .eq("name", PreviousSubjectData.name);

    if (previousTeacherError)
      throw new Error("Error fetching previous teacher");

    const previousTeacher = previousTeacherData[0];
    if (previousTeacher) {
      let previousTeaches = previousTeacher.teaches || {};
      if (previousTeaches[className]) {
        previousTeaches[className] = previousTeaches[className].filter(
          (subj) => subj !== PreviousSubjectData.subject
        );
        if (previousTeaches[className].length === 0)
          delete previousTeaches[className];

        const { error: previousUpdateError } = await supabase
          .from("teachers")
          .update({ teaches: previousTeaches })
          .eq("name", PreviousSubjectData.name);

        if (previousUpdateError)
          throw new Error("Error updating previous teacher");
      }
    }
  }

  // Update the current teacher's teaches field
  if (currentTeacherData) {
    let currentTeaches = currentTeacherData.teaches || {};
    currentTeaches[className] = currentTeaches[className] || [];

    if (
      PreviousSubjectData.subject &&
      PreviousSubjectData.subject !== subjectName
    ) {
      currentTeaches[className] = currentTeaches[className].filter(
        (sbj) => sbj !== PreviousSubjectData.subject
      );
    }

    currentTeaches[className] = [
      ...new Set([...currentTeaches[className], subjectName]),
    ];

    const updateFields = { teaches: currentTeaches };
    updateFields.isFormTeacher = isFormTeacher === "yes" ? [className] : null;

    const { error: currentUpdateError } = await supabase
      .from("teachers")
      .update(updateFields)
      .eq("name", subjectTeacher);

    if (currentUpdateError) throw new Error("Error updating current teacher");
  }

  // Update exam scores for students
  const studentInClass = await fetchStudents(className);
  for (const student of studentInClass) {
    const examScores = student.examScores || {
      firstTerm: {},
      secondTerm: {},
      thirdTerm: {},
    };

    // Rename subject in each term if it exists
    ["firstTerm", "secondTerm", "thirdTerm"].forEach((term) => {
      if (examScores[term][PreviousSubjectData.subject]) {
        examScores[term][subjectName] =
          examScores[term][PreviousSubjectData.subject];
        delete examScores[term][PreviousSubjectData.subject];
      }
    });

    const { error: updateStudentError } = await supabase
      .from("students")
      .update({ examScores })
      .eq("id", student.id);

    if (updateStudentError) {
      console.error(
        `Error updating student ${student.id}:`,
        updateStudentError.message
      );
      throw new Error(`Error updating student ${student.id}`);
    }
  }

  return { message: "Subject assigned and exam scores updated successfully" };
}

// Function to get all subjects in a particular class with their assigned teacher
export async function getSubjectsInClass(className) {
  const { data, error } = await supabase.from("teachers").select("*");
  if (error) throw new Error("Error fetching teachers:", error);
  console.log(data);

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

  const studentInClass = await fetchStudents(className);

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

  // Update teacher's teaches field
  if (teacherData) {
    let teaches = teacherData.teaches || {};
    teaches[className] = teaches[className] || [];

    if (teaches[className].includes(subjectName)) {
      throw new Error("Subject already exists for this teacher");
    }

    teaches[className].push(subjectName);

    const updateFields = { teaches };
    console.log(teaches);

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

  // Initialize default score structure for the new subject in all terms
  const defaultSubjectScores = {
    [subjectName]: {
      firstTest: 0,
      secondTest: 0,
      exam: 0,
    },
  };

  // Update exam scores for each student
  for (const student of studentInClass) {
    const examScores = student.examScores || {
      firstTerm: {},
      secondTerm: {},
      thirdTerm: {},
    };

    // Check if the subject already exists in any term
    if (
      examScores?.firstTerm?.[subjectName] ||
      examScores?.secondTerm?.[subjectName] ||
      examScores?.thirdTerm?.[subjectName]
    ) {
      throw new Error(`Subject ${subjectName} already exists for this class`);
    }

    // Add the default score structure to each term for the new subject
    examScores.firstTerm = {
      ...examScores.firstTerm,
      ...defaultSubjectScores,
    };
    examScores.secondTerm = {
      ...examScores.secondTerm,
      ...defaultSubjectScores,
    };
    examScores.thirdTerm = {
      ...examScores.thirdTerm,
      ...defaultSubjectScores,
    };

    const { error: updateStudentError } = await supabase
      .from("students")
      .update({ examScores })
      .eq("id", student.id);

    if (updateStudentError) {
      console.error(
        `Error updating student ${student.id}:`,
        updateStudentError.message
      );
      throw new Error(`Error updating student ${student.id}`);
    }
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

  // Update each student's exam scores for all terms
  for (const student of studentsInClass) {
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

    const { error: updateStudentError } = await supabase
      .from("students")
      .update({ examScores })
      .eq("id", student.id);

    if (updateStudentError) {
      console.error(
        `Error updating student ${student.id}:`,
        updateStudentError.message
      );
      throw new Error(`Error updating student ${student.id}`);
    }
  }

  return {
    message:
      "Subject deleted and exam scores updated successfully across all terms",
  };
}
