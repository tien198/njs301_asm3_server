import type { IOrder } from "../../interfaces/order";

export default function orderInformMail(order: IOrder) {
    return `
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chi Tiết Đơn Hàng</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
    </style>
</head>

<body>

    <div style="background-color: #1a1a1a; color: #fff; font-family: Arial, sans-serif; padding: 15rem 5rem;">
        <h2 style="margin-bottom: 5px;">Xin Chào ${order.userName}</h2>
        <p style="font-weight: bold;">Phone: ${order.shippingTracking.phone}</p>
        <p><strong>Address:</strong> ${order.shippingTracking.address}/p>

        <table cellspacing="5" cellpadding="10"
            style="width: 100%; margin-top: 20px; border-collapse: separate;  border-spacing: 5px; text-align: center; color: #fff;">
            <thead>
                <tr>
                    <th style="border: 1px solid white; width: 35%;">Tên Sản Phẩm</th>
                    <th style="border: 1px solid white; width: 15%;">Hình Ảnh</th>
                    <th style="border: 1px solid white; width: 15%;">Giá</th>
                    <th style="border: 1px solid white; width: 10%;">Số Lượng</th>
                    <th style="border: 1px solid white; width: 15%;">Thành Tiền</th>
                </tr>
            </thead>
            <tbody>`
        + order.items.map(item => `
                <tr>
                    <td style="border: 1px solid white;">${item.name}</td>
                    <td style="border: 1px solid white;">
                        <img src="${item.imageUrl}"
                            alt="iPhone 13 Pro Max" style="width: 60px; height: auto;" />
                    </td>
                    <td style="border: 1px solid white;">$ ${item.priceInOrderTime}</td>
                    <td style=" border: 1px solid white;">${item.quantity}</td>
                    <td style="border: 1px solid white;">$ ${item.lineTotal}</td>
                </tr>`).join('')
        +
        `   </tbody>
        </table>

        <h2 style=" margin-top: 30px;">Tổng Thanh Toán:</h2>
        <p style="font-size: 24px; font-weight: bold;">$ ${order.totalPrice}</p>

        <h2 style="margin-top: 40px;">Cảm ơn bạn!</h2>
    </div>

</html>

</body>

</html>`

} 