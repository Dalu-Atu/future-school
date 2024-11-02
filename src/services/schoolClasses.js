import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "./supabase";
import toast from "react-hot-toast";

export async function getClassess() {
  try {
    let { data: classes, error } = await supabase.from("classes").select("*");
    if (error) {
      console.error("Error fetching classes:", error.message);
      throw new Error("Error fetching classes:", error.message);
    }
    return classes;
  } catch (err) {
    console.error("Error in getClassess:", err);
    throw err;
  }
}

export async function getSpecificClass() {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .in("section", ["pc", "primary"]);

  const classList = data.map((cls) => cls.name);

  if (error)
    throw new Error("Could not get class. Check your network:", error.message);
  return classList;
}

export async function AddClass(classToAdd) {
  const { data, error } = await supabase
    .from("classes")
    .insert([classToAdd])
    .select();
  if (error) throw new Error(error.message);
  return data;
}
export async function deleteClass(className) {
  if (!className) throw new Error("no selected class");

  const { error } = await supabase
    .from("classes")
    .delete()
    .eq("name", className);
  if (error?.code === "23503")
    throw new Error("Cannot delete class with students on it");
  if (error) throw new Error(" Class could not be deleted:", error?.message);
}
export async function updateClass(classToUpdate) {
  const name = classToUpdate[0].previousName;

  const { data, error } = await supabase
    .from("classes")
    .update(classToUpdate[1])
    .match({ name: name });
  if (error) throw new Error(" Class could not be deleted:", error.message);
  if (error) console.log(error);
  return data;
}

export function useAddClass() {
  const queryClient = useQueryClient();

  const { mutateAsync: addingClass, isPending: isAddingClass } = useMutation({
    mutationFn: async (data) => await AddClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classess"],
      });
      toast.success("Class added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  return { addingClass, isAddingClass };
}
export function useUpdateClass() {
  const queryClient = useQueryClient();

  const { mutateAsync: updatingClass, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => await updateClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classess"],
      });
      toast.success("Class updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });
  return { updatingClass, isUpdating };
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  const { mutateAsync: deletingClass, isPending: isDeletingClass } =
    useMutation({
      mutationFn: async (data) => await deleteClass(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["classess"],
        });
        toast.success("Class deleted successfully");
      },
      onError: (error) => toast.error(error.message),
    });

  return { deletingClass, isDeletingClass };
}

// const queryClient = useQueryClient();

// const { mutateAsync: addSubject, isLoading: isAddingSubject } = useMutation({
//     mutationFn: async (subjectToAssign) =>
//       await addAsignSubject(subjectToAssign),

//     onSuccess: (data) => {
//       console.log(data);
//       if (!data) throw new Error('something went wrong. try again')
//       queryClient.invalidateQueries({
//         queryKey: ['subjects', id],
//       });
//       toast.success('subject successfully updated');
//     },
//     onError: (err) => toast.error(err.message),
//   });

//   return {addSubject, isAddingSubject}
// }
