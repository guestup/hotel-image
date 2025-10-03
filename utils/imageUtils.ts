export const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The base64 data is everything after the first comma in the data URL.
      const base64Data = result.split(',')[1];
      if (!base64Data) {
        return reject(new Error("Invalid file format for Base64 conversion."));
      }
      // Use the file's `type` property for the MIME type. This is more reliable
      // and correctly formatted (e.g., "image/jpeg") for the Gemini API.
      resolve({ mimeType: file.type, data: base64Data });
    };
    reader.onerror = (error) => reject(error);
  });
};
