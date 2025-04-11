export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getEmojiForCategory = (category?: string) => {
  if (!category) return '';
  switch (category) {
    case 'Wood':
      return '🪵';
    case 'Metals':
      return '🔩';
    case 'Textiles':
      return '🧵';
    default:
      return '';
  }
};