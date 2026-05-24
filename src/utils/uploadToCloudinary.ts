import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config/cloudinary';

export async function uploadToCloudinary(
  fileOrBase64: string | File,
  fileName: string
): Promise<string> {
  const formData = new FormData();
  
  if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
    const response = await fetch(fileOrBase64);
    const blob = await response.blob();
    formData.append('file', blob, fileName);
  } else if (fileOrBase64 instanceof File) {
    formData.append('file', fileOrBase64, fileName);
  } else {
    throw new Error('Invalid file input');
  }
  
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'harshphalke_bookings');
  
  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.json();
    throw new Error(`Cloudinary upload failed: ${errorData.error?.message || uploadResponse.statusText}`);
  }
  
  const data = await uploadResponse.json();
  return data.secure_url as string;
}