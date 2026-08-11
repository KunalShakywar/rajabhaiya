import { useState } from "react";
import QRScanner from "../components/QRScanner";

export default function ScannerPage() {
    const [result, setResult] = useState("");

    return (
        <div className="p-6 space-y-4">
            <QRScanner onScan={setResult} />

            {result && (
                <div className="p-3 bg-green-100 rounded-lg">
                    <b>Result:</b> {result}
                </div>
            )}
        </div>
    );
}