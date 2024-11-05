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
    if (
      previousSubjectData.subject &&
      previousSubjectData.subject !== subjectName
    ) {
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
      if (examScores[term][previousSubjectData.subject]) {
        examScores[term][subjectName] =
          examScores[term][previousSubjectData.subject];
        delete examScores[term][previousSubjectData.subject];
      }

      // Ensure the new subject is added in all terms if not present
      if (!examScores[term][subjectName]) {
        examScores[term][subjectName] = {
          firstTest: 0,
          secondTest: 0,
          exam: 0,
        };
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

  // Prepare default score structure for the new subject in all terms
  const defaultSubjectScores = {
    [subjectName]: {
      firstTest: 0,
      secondTest: 0,
      exam: 0,
    },
  };

  // Gather updates for all students
  const studentUpdates = studentInClass.map((student) => {
    // Initialize examScores if not defined
    const examScores = student.examScores || {
      firstTerm: {},
      secondTerm: {},
      thirdTerm: {},
    };

    console.log(student);
    // Check if the subject already exists in any term
    if (
      examScores.firstTerm[subjectName] !== undefined ||
      examScores.secondTerm[subjectName] !== undefined ||
      examScores.thirdTerm[subjectName] !== undefined
    ) {
      throw new Error(`Subject ${subjectName} already exists for this class`);
    }

    // Ensure all terms have an entry for the subject
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

    return supabase
      .from("students")
      .update({ examScores })
      .eq("id", student.id);
  });

  // Perform all student updates in parallel
  const updateResults = await Promise.all(studentUpdates);

  // Check for errors in batch update
  for (const result of updateResults) {
    if (result.error) {
      console.error("Error updating student:", result.error.message);
      throw new Error("Error updating students");
    }
  }

  return { message: "Subject assigned and exam scores updated successfully" };
}

export async function deleteSubject(subjectToDelete) {
  const { name, className, subject } = subjectToDelete;

  // Fetch the teacher data
  const { data, error } = await supabase
    .from("teachers")
    .select("teaches")
    .eq("name", name)
    .single();

  if (error) throw new Error("Error fetching previous teacher");

  const teacher = data;
  console.log("Fetched Teacher:", teacher);

  if (teacher) {
    let previousTeaches = teacher.teaches || {};
    console.log("Previous Teaches:", previousTeaches);

    if (previousTeaches[className]) {
      console.log("Current subjects for class:", previousTeaches[className]);
      console.log("Subject to delete:", subject);

      // Remove the subject from the teacher's class list
      previousTeaches[className] = previousTeaches[className].filter(
        (subj) => subj.trim().toLowerCase() !== subject.trim().toLowerCase()
      );

      console.log("Updated subjects for class:", previousTeaches[className]);

      // Delete the class if no subjects are left
      // if (previousTeaches[className].length === 0) {
      //   delete previousTeaches[className];
      // }

      const { error: previousUpdateError } = await supabase
        .from("teachers")
        .update({ teaches: {} })
        .eq("name", teacher.name);

      if (previousUpdateError) {
        console.error("Previous Update Error:", previousUpdateError);
        throw new Error("Error updating previous teacher");
      }
    }
  }

  // The rest of your function remains unchanged...
}
