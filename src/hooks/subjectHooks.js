import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAsignSubject,
  addOrUpdateAssignedSubject,
  deleteSubject,
} from "../services/schoolsbj";
import toast from "react-hot-toast";

export function useUpdateSubject(id) {
  const queryClient = useQueryClient();
  const { mutateAsync: updatingSubject, isLoading: isUpdating } = useMutation({
    mutationFn: async (subjectToAssign) =>
      addOrUpdateAssignedSubject(subjectToAssign),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subjects", id],
      });
      toast.success("Subject successfully updated");
    },
    onError: (err) => toast.error(err.message),
  });
  return { updatingSubject, isUpdating };
}

export function useAddSubject(id) {
  const queryClient = useQueryClient();

  const { mutateAsync: addSubject, isLoading: isAddingSubject } = useMutation({
    mutationFn: async (subjectToAssign) =>
      await addAsignSubject(subjectToAssign),

    onSuccess: (data) => {
      if (!data) throw new Error("something went wrong. try again");
      queryClient.invalidateQueries({
        queryKey: ["subjects", id],
      });
      toast.success("subject successfully updated");
    },
    onError: (err) => toast.error(err.message),
  });

  return { addSubject, isAddingSubject };
}

export function useRemoveSubject(id) {
  const queryClient = useQueryClient();
  const { mutateAsync: removeSubject, isLoading: isRemovingSubject } =
    useMutation({
      mutationFn: (subjectTodelete) => deleteSubject(subjectTodelete),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["subjects", id],
        });
        //   clearForm();
        //   setShowForm((showForm) => false);
        toast.success("Subject deleted successfully");
      },
      onError: (error) => toast.error(error.message),
    });

  return { removeSubject, isRemovingSubject };
}
