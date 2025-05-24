export async function uploadImages(
  files: File[],
  uploaderName?: string,
  description?: string,
): Promise<void> {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`file-${index}`, file);
  });

  if (uploaderName) {
    formData.append('uploaderName', uploaderName);
  }

  if (description) {
    formData.append('description', description);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Upload failed');
  }

  return response.json();
}
