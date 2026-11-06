const driveFileId = (value: string) => {
  const match = value.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([a-zA-Z0-9_-]+)/i);
  return match?.[1] || null;
};

export const normalizeMediaUrl = (value: string, kind: 'image' | 'video' = 'image') => {
  const trimmed = value.trim();
  const fileId = driveFileId(trimmed);
  if (!fileId) return trimmed;
  return kind === 'video'
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : `https://lh3.googleusercontent.com/d/${fileId}`;
};

export const isMediaDataUrl = (value: string) => /^data:(image|video)\//i.test(value);
