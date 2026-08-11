import QRCode from "react-qr-code";

export default function QRGenerator({ value, title = "QR Code" }) {
    return (
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-3">
            <h2 className="text-lg font-bold">{title}</h2>

            <div className="bg-white p-3 rounded-xl border">
                <QRCode
                    value={value || "No Data"}
                    size={180}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="H"
                />
            </div>

            <p className="text-xs text-gray-500 break-all text-center">
                {value}
            </p>
        </div>
    );
}