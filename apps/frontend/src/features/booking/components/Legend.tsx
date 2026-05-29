import { PRICES } from "@/features/booking/types/booking";

const Legend = () => {
    return (
        <div className="border-t pt-6">
            <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <span className="text-sm text-gray-600">Ghế thường ({PRICES.Sida.toLocaleString('vi-VN')}đ)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                    <span className="text-sm text-gray-600">Ghế VIP ({PRICES.Vip.toLocaleString('vi-VN')}đ)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pink-400 rounded"></div>
                    <span className="text-sm text-gray-600">Ghế đôi ({PRICES.Couple.toLocaleString('vi-VN')}đ)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded"></div>
                    <span className="text-sm text-gray-600">Ghế đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    <span className="text-sm text-gray-600">Ghế đã đặt</span>
                </div>
            </div>
        </div>
    );
};

export default Legend;


