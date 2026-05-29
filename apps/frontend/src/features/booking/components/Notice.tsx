import { AlertCircle } from "lucide-react";

interface NoticeProps {
    errorMessage: string | null;
}

const Notice = ({ errorMessage }: NoticeProps) => {
    return (
        <>
            {errorMessage && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-600 mt-0.5" size={20} />
                    <div className="text-sm text-red-700">{errorMessage}</div>
                </div>
            )}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Mỗi giao dịch chỉ được đặt 1 ghế</li>
                        <li>Vui lòng thanh toán trong vòng 10 phút sau khi chọn ghế</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Notice;


