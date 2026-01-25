export const getImage64 = async (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        const base64Result = reader.result;
        resolve(base64Result);
      } else {
        reject(new Error("Failed to read file or result is not a string"));
      }
    };

    reader.readAsDataURL(file);
  });
};

export function getMimeFromImage64(dataUrl: string): string | undefined {
  const match = dataUrl.match(/^data:(.*?);base64,/);
  return match ? match[1] : undefined;
}
