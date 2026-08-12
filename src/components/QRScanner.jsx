
import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/library";
import { FiCheck } from "react-icons/fi";

export default function QRScanner({ onScan }) {
    const videoRef = useRef(null);
    const readerRef = useRef(null);

    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const [detected, setDetected] = useState(false);
    const [scannerActive, setScannerActive] = useState(true);

    useEffect(() => {
        if (!scannerActive) return;

        const codeReader = new BrowserQRCodeReader();
        readerRef.current = codeReader;

        codeReader
            .decodeFromVideoDevice(undefined, videoRef.current, (res) => {
                if (!res) return;

                const text = res.getText();

                if (text !== result) {
                    setResult(text);
                    setDetected(true);

                    console.log("QR Scanned:", text);

                    // Parent ko data bhejo
                    onScan?.(text);

                    // Camera stop karo
                    codeReader.reset();
                    setScannerActive(false);
                }
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });

        return () => codeReader.reset();
    }, [scannerActive, onScan, result]);

    // Dobara scan karne ke liye
    const startAgain = () => {
        setResult("");
        setDetected(false);
        setError("");
        setScannerActive(true);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800">
                QR Scanner
            </h2>

            <div
                className={`relative overflow-hidden rounded-2xl border-4 transition-all duration-300 ${detected
                    ? "border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.8)]"
                    : "border-blue-500 shadow-md"
                    }`}
            >
                {scannerActive ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-72 bg-black object-cover"
                        />

                        {/* Scanner line */}
                        <div className="absolute left-0 w-full h-1 bg-blue-400 animate-[scan_2s_linear_infinite]"></div>
                    </>
                ) : (
                    <div className="w-full h-72 flex flex-col items-center justify-center bg-gray-900 text-white">
                        <div className="text-5xl mb-3 text-white p-1 bg-green-500 rounded-full"><FiCheck /></div>
                        <p className="font-semibold">QR Detected</p>

                    </div>
                )}
            </div>

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-xl border border-red-200 text-sm">
                    {error}
                </div>
            )}

            {!scannerActive && (
                <button
                    onClick={startAgain}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                    Scan Again
                </button>
            )}

            <style>
                {`
          @keyframes scan {
            0% {
              top: 0%;
            }
            100% {
              top: calc(100% - 4px);
            }
          }
        `}
            </style>
        </div>
    );
}

