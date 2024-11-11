import supabase from "./supabase";

export async function uploadFile(file, fieldName, settingsId) {
  try {
    const fileName = `${Date.now()}_${file.name}`;

    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Retrieve the public URL of the uploaded file
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    if (publicUrlError) {
      console.error("Public URL Error:", publicUrlError.message);
      throw new Error(
        `Failed to retrieve public URL: ${publicUrlError.message}`
      );
    }

    const publicURL = publicUrlData.publicUrl;

    // Fetch current settings
    const { data: settingsData, error: settingsError } = await supabase
      .from("settings")
      .select("*")
      .eq("id", BigInt(settingsId))
      .single();

    if (settingsError) {
      console.error("Settings Fetch Error:", settingsError.message);
      throw new Error(`Failed to fetch settings: ${settingsError.message}`);
    }

    // Update the settings with the new image URL
    const updatedImages = { ...settingsData.images, [fieldName]: publicURL };

    const { error: updateError } = await supabase
      .from("settings")
      .update({ images: updatedImages })
      .eq("id", BigInt(settingsId));

    if (updateError) {
      console.error("Update Error:", updateError.message);
      throw new Error(`Update failed: ${updateError.message}`);
    }

    return publicURL;
  } catch (error) {
    throw new Error("Error during file upload process:", error);
  }
}

export async function uploadImage(file, userId, cartegory) {
  try {
    const fileName = `${userId}_${Date.now()}_${file.name}`;

    // Upload the file to Supabase storage

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Retrieve the public URL of the uploaded file
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    if (publicUrlError) {
      console.error("Public URL Error:", publicUrlError.message);
      throw new Error(
        `Failed to retrieve public URL: ${publicUrlError.message}`
      );
    }

    const publicURL = publicUrlData.publicUrl;

    // Update the user's image URL in the database
    const { error: updateError } = await supabase
      .from(`${cartegory}s`.toLocaleLowerCase()) // replace with your actual user table name
      .update({ image: publicURL })
      .eq("id", userId);

    if (updateError) {
      console.error("Update Error:", updateError);
      throw new Error(`Update failed: ${updateError.message}`);
    }

    return publicURL;
  } catch (error) {
    console.error("Error during file upload process:", error);
    throw error;
  }
}
