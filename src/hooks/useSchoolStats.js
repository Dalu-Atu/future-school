import { useMutation, useQuery } from '@tanstack/react-query';

function useGetSchoolStats() {
  const { mutate: getSchoolStats, isPending: isGettingStats } = useQuery({
    queryFn: () => getSchoolStats(),
    queryKey: ['school stats'],
  });
  return { getSchoolStats, isGettingStats };
}

export default useGetSchoolStats;
