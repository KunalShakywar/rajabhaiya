import QRCode from "react-qr-code";
import { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { FiUser, FiPhoneCall, FiMapPin, FiCheck } from "react-icons/fi";

export default function CustomerCard({ customer }) {
    const [showQR, setShowQR] = useState(false);
    if (!customer) return null;

    const qrValue = JSON.stringify({
        customerId: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address || "",
    });

    const firstLetter = customer.name?.charAt(0)?.toUpperCase() || "C";
    return (
        <div className="w-full flex justify-center sm:p-4 print:p-0 print:min-h-screen print:items-center print:justify-center">
            <div className="w-full max-w-140  rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden print:shadow-none print:border-black">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-green-800 text-white px-4 sm:px-6 py-3 sm:py-4">
                    <h2 className="text-lg sm:text-2xl font-bold tracking-wide">
                        Shri Ganesh Dairy
                    </h2>
                    <p className="text-xs sm:text-sm opacity-90">
                        Customer Membership Card
                    </p>
                </div>

                {/* Body */}
                <div className="flex items-center justify-between gap-3 sm:gap-6 p-3 sm:p-6">
                    {/* Left Side */}
                    <div>


                        {/* Details */}
                        <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                            <div className="space-y-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FiUser className="text-gray-600  dark:text-gray-300 flex-shrink-0" />
                                        <h3 className="text-sm sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
                                            {customer.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2  text-[10px] sm:text-sm text-gray-500 dark:text-white">
                                        <FiCheck className="flex-shrink-0" />
                                        <span>CID: SGD{customer.id}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-[11px] sm:text-sm">
                                    <div className="flex items-center gap-2">
                                        <FiPhoneCall className="text-gray-600 dark:text-white flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-white">{customer.phone || "-"}</span>
                                    </div>

                                    <div className="flex items-start gap-2 ">
                                        <FiMapPin className="text-gray-600 dark:text-white mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 break-words dark:text-white">
                                            {customer.address || "No Address"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-center gap-1 sm:gap-3 shrink-0">
                        <div
                            onClick={() => setShowQR(true)}
                            className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                        >
                            <QRCode
                                value={qrValue}
                                size={110}
                                bgColor="#FFFFFF"
                                fgColor="#111827"
                                level="H"
                            />
                        </div>

                        <p className="text-[10px] sm:text-[11px] text-gray-500 text-center max-w-30 leading-tight">
                            Tap QR to enlarge
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="  dark:bg-gray-900 px-3 sm:px-6 py-3 sm:py-4 bg-gray-50">
                    <button
                        onClick={() => window.print()}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-colors print:hidden"
                    >
                        🖨 Print Card
                    </button>
                </div>
                {showQR && (
                    <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="flex flex-col items-center gap-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Scan Customer QR
                            </h3>

                            <QRCode
                                value={qrValue}
                                size={260}
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                                level="H"
                            />

                            <button
                                onClick={() => setShowQR(false)}
                                className=" text-rose-200 bg-red-400   rounded-full font-medium"
                            >
                                <ImCancelCircle size={24} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}