import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from './supabase';
import toast from 'react-hot-toast';

export async function updateSchoolSettings(newSettings) {
  try {
    // Fetch existing settings
    const { data: existingSettings, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      throw new Error(`Error fetching settings: ${error.message}`);
    }

    if (!existingSettings || existingSettings.length === 0) {
      // No rows found, insert new settings
      const { error: insertError } = await supabase
        .from('settings')
        .insert([newSettings]);

      if (insertError) {
        throw new Error(`Error inserting new settings: ${insertError.message}`);
      }
    } else if (existingSettings.length === 1) {
      // Exactly one row found, update the existing settings
      const { error: updateError } = await supabase
        .from('settings')
        .update(newSettings)
        .eq('id', existingSettings[0].id); // Assuming there is an 'id' field to identify the row

      if (updateError) {
        throw new Error(`Error updating settings: ${updateError.message}`);
      }
    } else {
      // More than one row found, log an error
      console.error(
        'Error: Multiple settings rows found. This should not happen.'
      );
    }
  } catch (error) {
    console.error('Error in updateSchoolSettings:', error.message);
  }
}

export async function getSettings() {
  // Fetch existing settings
  const { data: schoolSettings, error } = await supabase
    .from('settings')
    .select('*')
    .single();
  if (error)
    toast.error(
      error.message === 'JSON object requested, multiple (or no) rows returned'
        ? 'Please provide school details'
        : error.message
    );

  return schoolSettings;
}

export function useModifySettings() {
  const queryClient = useQueryClient();

  const { mutateAsync: modifySettings, isPending: isModifying } = useMutation({
    mutationFn: async (data) => updateSchoolSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      toast.success('Settings Updated Successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { modifySettings, isModifying };
}
export function useGetSchoolSettings() {
  const { data, isLoading, error } = useQuery({
    queryFn: getSettings,
    queryKey: ['settings'],
  });

  if (error) throw new Error(error.message);
  return { data, isGettingSettings: isLoading };
}
