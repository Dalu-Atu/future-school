import { useNavigate } from "react-router-dom";
import supabase from "./supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../services/AuthContext";

export async function fetchLoggedInUser() {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;

    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData || !authData.user) {
      return null; // Return null to indicate no user is logged in
    }
    const userEmail = authData?.user?.email;
    const username = userEmail.split("@")[0];

    // Attempt to fetch from the "teachers" table
    const { data: teacherData } = await supabase
      .from("teachers")
      .select("*")
      .eq("username", username)
      .single();

    if (teacherData) {
      return { user: authData.user, data: teacherData, cartegory: "Teacher" };
    }

    // // Attempt to fetch from the "students" table if not found in "teachers"
    const { data: studentData } = await supabase
      .from("students")
      .select("*")
      .eq("username", username)
      .single();

    if (studentData)
      return { user: authData.user, data: studentData, cartegory: "Student" };

    const { data: adminsData } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();

    if (adminsData) {
      return { user: authData.user, data: adminsData, cartegory: "Admin" };
    }
  } catch (error) {
    toast.error(error.message);
  }
}

export async function loginStudent({ email, password, cartegory }) {
  const username = email.split("@").at(0);
  let { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("username", username)
    .single();

  if (studentError) throw new Error("Invalid login credentials");
  return studentData;
}

export async function loginAdminAccount({ email, password, cartegory }) {
  const username = email.split("@").at(0);
  let { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  const { data: adminsData, error: studentError } = await supabase
    .from("admins")
    .select("*")
    .eq("username", username)
    .single();

  if (studentError) throw new Error("Invalid login credentials");
  return adminsData;
}

export async function loginTeacher({ email, password, cartegory }) {
  const username = email.split("@").at(0);
  let { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) console.log(error);
  if (error) throw new Error(error.message);

  const { data: teacherData, error: teacherError } = await supabase
    .from("teachers")
    .select("*")
    .eq("username", username)
    .single();

  if (teacherError) throw new Error(teacherError.message);
  if (teacherData) return teacherData;
}
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export function useLoginTeacher() {
  const navigate = useNavigate();
  const { mutate: loginTeacherIn, isPending: isLoggingTeacherIn } = useMutation(
    {
      mutationFn: ({ email, password, cartegory }) =>
        loginTeacher({ email, password, cartegory }),
      onSuccess: (data) => {
        if (!data)
          return toast.error("Provided email or password are incorrect");
        navigate("/account/dashboard");
      },
      onError: (error) => {
        toast.error(
          error.message ==
            "JSON object requested, multiple (or no) rows returned"
            ? "No user found with the provided information"
            : error.message
        );
      },
    }
  );

  return { loginTeacherIn, isLoggingTeacherIn };
}

export function useLoginStudent() {
  const { queryClient } = useAuth();
  const navigate = useNavigate();

  const { mutate: loginStudentIn, isPending: isLoggingStudentIn } = useMutation(
    {
      mutationFn: ({ email, password, cartegory }) =>
        loginStudent({ email, password, cartegory }),
      onSuccess: (data) => {
        if (!data)
          return toast.error("Provided email or password are incorrect");
        queryClient.invalidateQueries("student"); // Refetch teacher data on login
        navigate("/account/dashboard");
      },
      onError: (error) => {
        toast.error(
          error.message ==
            "JSON object requested, multiple (or no) rows returned"
            ? "No user found with the provided information"
            : error.message
        );
      },
    }
  );

  return { loginStudentIn, isLoggingStudentIn };
}
export function useLoginAdmin() {
  const { queryClient } = useAuth();
  const navigate = useNavigate();

  const { mutate: loginAdmin, isPending: isLoggingIn } = useMutation({
    mutationFn: ({ email, password, cartegory }) =>
      loginAdminAccount({ email, password, cartegory }),
    onSuccess: (data) => {
      if (!data) return toast.error("Provided email or password are incorrect");
      queryClient.invalidateQueries("student"); // Refetch teacher data on login
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(
        error.message == "JSON object requested, multiple (or no) rows returned"
          ? "No user found with the provided information"
          : error.message
      );
    },
  });

  return { loginAdmin, isLoggingIn };
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data } = await supabase.auth.getUser();

  return data?.user;
}

export function useUser() {
  const {
    isLoading,
    data: user,
    isFetching,
  } = useQuery({
    queryFn: fetchLoggedInUser,
    queryKey: ["user"],
  });

  return { isLoading, user, isFetching };
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logoutUser, isLoading: isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/");
    },
  });

  return {
    logoutUser,
    isPending,
  };
}
