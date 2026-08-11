import { useState } from "react";
import QRScanner from "../components/QRScanner";

export default function ScannerPage() {
    const [result, setResult] = useState("");

    return (
        <div>
            <QRScanner onScan={setResult} />

            <p>{result}</p>
        </div>
    );
}