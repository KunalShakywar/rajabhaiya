import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/library";

export default function QRScanner({ onScan }) {
    const videoRef = useRef(null);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const codeReader = new BrowserQRCodeReader();

        codeReader
            .decodeFromVideoDevice(undefined, videoRef.current, (res) => {
                if (res) {
                    const text = res.getText();

                    // duplicate scan avoid
                    if (text !== result) {
                        setResult(text);
                        console.log("QR Scanned:", text);

                        // parent ko bhejo
                        onScan?.(text);
                    }
                }
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });

        return () => codeReader.reset();
    }, [onScan, result]);

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-bold text-center mb-4">
                QR Scanner
            </h2>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-72 rounded-lg border bg-black object-cover"
            />

            {result && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg break-all">
                    <strong>Scanned:</strong> {result}
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}