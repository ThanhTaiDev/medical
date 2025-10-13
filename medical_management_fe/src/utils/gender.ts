/**
 * Chuyển đổi giá trị giới tính từ tiếng Anh sang tiếng Việt
 * @param gender - Giá trị giới tính: MALE, FEMALE, OTHER
 * @returns Tên giới tính bằng tiếng Việt
 */
export const getGenderLabel = (gender?: string | null): string => {
  if (!gender) return 'Chưa cập nhật';
  
  switch (gender.toUpperCase()) {
    case 'MALE':
      return 'Nam';
    case 'FEMALE':
      return 'Nữ';
    case 'OTHER':
      return 'Khác';
    default:
      return gender; // Trả về giá trị gốc nếu không khớp
  }
};

