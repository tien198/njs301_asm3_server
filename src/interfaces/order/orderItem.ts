import type { Types } from "mongoose";

// Item trong đơn hàng
export default interface IOrderItem {
    productId: Types.ObjectId; // ID sản phẩm
    name: string;      // Tên sản phẩm (dự phòng nếu sản phẩm bị xóa)
    price: number;     // Giá tại thời điểm đặt
    quantity: number;  // Số lượng mua
    image?: string;    // Hình ảnh sản phẩm (tùy chọn)
}