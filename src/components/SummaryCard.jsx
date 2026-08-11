export default function SummaryCard({ total }) {
    return (
        <div className="flex justify-end">
            <div className="bg-white p-6 rounded-xl shadow w-72">
                <h2 className="text-xl font-bold mb-3">Bill Summary</h2>

                <div className="flex justify-between text-lg font-semibold">
                    <span>Grand Total</span>
                    <span className="text-blue-600">₹{total}</span>
                </div>
            </div>
        </div>
    );
}