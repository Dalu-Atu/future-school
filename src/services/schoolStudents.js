import { QueryClient, useMutation } from "@tanstack/react-query";
import supabase from "./supabase";
import { getFormTeacherForClass } from "./teachersService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export async function fetchStudents(clsId) {
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("class_id", clsId);

  const formTeacher = await getFormTeacherForClass(clsId);
  if (students[0]) students[0].formTeacher = formTeacher || "";

  if (error) throw new Error("Error fetching students:", error.message);
  return students;
}

export async function fetchAllStudents(clsId) {
  const { data: students, error } = await supabase.from("students").select("*");
  if (error) throw new Error("Error fetching students:", error.message);
  return students;
}

const accessStudentResult = async (data) => {
  // Fetch students in the specified class
  const allStudent = await fetchStudents(data.clsId);

  // Find the student with a matching pin
  let matchingStudent = allStudent.find((student) => student.pin === data.pin);

  if (!matchingStudent)
    throw new Error("Student with the specified pin not found.");
  matchingStudent = {
    ...matchingStudent,
    formTeacher: allStudent[0].formTeacher,
    count: allStudent.length,
  };

  return { matchingStudent, allStudent };
};
export function useAccessResult() {
  const navigate = useNavigate();
  const { mutate: accessResult, isPending: isAccessingResult } = useMutation({
    mutationFn: (data) => accessStudentResult(data),
    onSuccess: (data) => {
      if (!data) return toast.error("Provided card pin is  incorrect");
      navigate("/student-result", { state: { data } });
    },
    onError: (error) => {
      toast.error(
        error.message == "JSON object requested, multiple (or no) rows returned"
          ? "No user found with the provided information"
          : error.message
      );
    },
  });

  return { accessResult, isAccessingResult };
}
// 2920533018
// 5529001995;
