// Trong utils/SlugUtil.js
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w\-]+/g, "") // Xóa ký tự không phải chữ, số, hoặc gạch ngang
    .replace(/\-\-+/g, "-"); // Thay nhiều gạch ngang liên tiếp bằng một gạch ngang
};

const unslugify = (slug) => {
  return slug
    .replace(/-/g, " ") // Chuyển dấu gạch ngang thành khoảng trắng
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Viết hoa chữ cái đầu mỗi từ
};

module.exports = { slugify, unslugify };
