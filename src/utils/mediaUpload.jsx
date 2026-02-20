import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

export default function mediaUpload(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      reject("No file selected");
    } else {
      const timestamp = new Date().getTime();
      const fileName = timestamp + file.name;

      supabase.storage
        .from("images")
        .upload(fileName, file, {
          upsert: false,
          cacheControl: "3600",
        })
        .then(() => {
          const publicUrl = supabase.storage
            .from("images")
            .getPublicUrl(fileName).data.publicUrl;

          resolve(publicUrl);
        })
        .catch(() => {
          reject("An error occurred");
        });
    }
  });
}
