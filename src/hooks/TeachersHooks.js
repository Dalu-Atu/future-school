// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { admitNewTeacher } from "../services/teachersService";
// import toast from "react-hot-toast";

// export async function  useAdmitTeacher () {
//     const queryClient = useQueryClient();
//     const { mutateAsync: addTeacher, isPending: isAdding } = useMutation({
//         mutationFn:  (data)=> alert('p'),
//         onSuccess: () => {
//           queryClient.invalidateQueries({
//             queryKey: ['teachers'],
//           });
//           toast.success('Teacher Admitted');
//         },
//         onError: (error) => toast.error(error.message),
//       });
//     return {addTeacher, isAdding}
//
// }
