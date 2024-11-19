import toast from "react-hot-toast";
import supabase from "./supabase";

export async function admitUser({ data, cartegory }) {
  const nameParts = data.name.split(" ");
  const userName = `${nameParts[0] + nameParts[1]}`.toLocaleLowerCase();

  const email = `${userName}@gmail.com`;
  let password = `${data.password}`.toLocaleLowerCase();

  if (password.length < 6) {
    const padding = "1".repeat(6 - password.length);
    password += padding;
  }

  data.username = userName;
  data.password = password;

  const { error: addingUserError } = await supabase
    .from(cartegory)
    .insert([data])
    .select();

  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) throw new Error(error.message);
  if (addingUserError) throw new Error(addingUserError.message);
  return user;
}

export async function getAllTeachers() {
  try {
    let { data: classes, error } = await supabase.from("teachers").select("*");
    if (error) throw new Error("Error fetching teachers:", error.message);
    return classes;
  } catch (error) {
    toast.error("Error fetching details. check internet connection");
  }
}

export async function updateUser({ data, cartegory }) {
  const namePartsOld = data[0].name.split(" ");
  const namePartsNew = data[1].name.split(" ");

  const oldUserName = (namePartsOld[0] + namePartsOld[1]).toLocaleLowerCase();
  const newUserName = (namePartsNew[0] + namePartsNew[1]).toLocaleLowerCase();

  const oldMail = `${oldUserName}@gmail.com`;
  const newMail = `${newUserName}@gmail.com`;

  let password = data[1].password;

  // Ensure password is at least 6 characters long
  if (password.length < 6) {
    const padding = "1".repeat(6 - password.length);
    password += padding;
  }

  // Prepare updated data
  data[1].username = newUserName;
  data[1].password = password;

  const id = data[0].id;

  try {
    // Try to fetch the user from the authentication system
    const { id: userUUIId } = await getCurrentUser(oldMail);

    // If user exists in the authentication system, update there
    if (userUUIId) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userUUIId,
        {
          email: newMail,
          password: password,
        }
      );

      if (authError) {
        throw new Error(authError.message);
      }
    }
  } catch (authError) {
    // If user is not found in the authentication system, log it
    console.warn("User not found in authentication system:", authError.message);
  }

  // Update the user data in the specified table
  const { data: updatedData, error } = await supabase
    .from(cartegory)
    .update(data[1])
    .eq("id", id);

  if (error) throw new Error(error.message);

  return updatedData;
}

export async function deleteUser({ userToDelete, cartegory }) {
  const email = `${userToDelete.username}@gmail.com`;

  // Get current user details based on the email

  const teacherId = userToDelete.id; // Assuming the id in the teachers table matches the user ID
  const currentUser = await getCurrentUser(email);
  if (currentUser) {
    const userUUIId = currentUser.id;
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userUUIId
      );

      if (authError) {
        console.error("Error deleting user from auth:", authError.message);
        throw new Error(authError.message);
      }
    } catch (error) {
      throw new Error("Error deleting user from auth:", error.message);
    }
    try {
      const { data, error } = await supabase
        .from(cartegory)
        .delete()
        .eq("id", teacherId);

      if (error) {
        console.error("Error deleting teacher data:", error.message);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error("Error deleting teacher data:", error.message);
    }
  } else {
    try {
      const { data, error } = await supabase
        .from(cartegory)
        .delete()
        .eq("id", teacherId);

      if (error) {
        console.error("Error deleting teacher data:", error.message);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error("Error deleting teacher data:", error.message);
    }
  }
}

async function getCurrentUser(oldMail) {
  try {
    // Fetch all users
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error.message);
      return null;
    }

    // Filter the users by the provided name

    const user = users.users.find((user) => {
      return user.email === oldMail;
    });

    if (!user) {
      return null;
    }

    return { user, id: user.id };
  } catch (error) {
    return null;
  }
}
export async function ChangeStudentPortalAccess(data) {
  const { std, condition } = data;
  const { data: student, error: fetchError } = await supabase
    .from("students")
    .select("*")
    .eq("id", std.id)
    .single();

  if (fetchError) {
    console.error("Error fetching student:", fetchError);
    return;
  }
  // Update the student's hasAccess field
  const { error: updateError } = await supabase
    .from("students")
    .update({ hasAccess: condition })
    .eq("id", student.id)
    .single();

  if (updateError) {
    console.error("Error updating student:", updateError);
    return;
  }
}

export const grantAllAccess = async (classStudents) => {
  const { data, error } = await supabase
    .from("students")
    .update({ hasAccess: true })
    .eq("class_id", classStudents);

  if (error) {
    throw error;
  }

  return data;
};

export async function getSchoolStatistics() {
  try {
    let { data: teachers, error: teachersError } = await supabase
      .from("teachers")
      .select("*");

    let { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*");

    if (teachersError || studentsError)
      throw new Error(teachersError.message || studentsError.message);

    const primaryStudents = students.filter((std) => std.section === "primary");
    const pcStudents = students.filter((std) => std.section === "pc");
    const secondaryStudents = students.filter(
      (std) => std.section === "secondary"
    );

    return {
      students: { students, primaryStudents, secondaryStudents, pcStudents },
      teachers,
    };
  } catch (error) {
    toast.error(
      "Error fetching details. check internet connection",
      error.message
    );
  }
}

export async function getFormTeacherForClass(className) {
  const { data, error } = await supabase
    .from("teachers")
    .select("name, isFormTeacher");

  if (error) throw new Error("Error fetching teachers:", error);

  // Find the teacher with the specified class in their isFormTeacher field
  const formTeacher = data.find(
    (teacher) =>
      teacher.isFormTeacher && teacher.isFormTeacher.includes(className)
  );

  // If a form teacher is found, return their name
  if (formTeacher) return formTeacher?.name || "";

  // Return message if no form teacher found

  return { message: "No form teacher found for this class." };
}
