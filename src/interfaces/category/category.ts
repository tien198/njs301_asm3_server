export default interface ICategory {
    name: string;
    slug: string;               // URL-friendly version of name, ví dụ: "ao-thun"

    parentId?: string | null;   // Nếu là category con, sẽ có parentId; nếu không có thì là category gốc

    image?: string;             // Ảnh đại diện cho category (dùng cho trang chủ hoặc menu)
    description?: string;

    isActive: boolean;          // Ẩn/hiện category (quan trọng khi có nhiều danh mục cũ)
}
