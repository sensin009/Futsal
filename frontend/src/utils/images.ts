export const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Use the backend URL for relative paths
  return `http://localhost:8000${path}`;
};
