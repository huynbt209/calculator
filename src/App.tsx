import Calculator from "./Calculator";
import CalculateInvoice from "./CalculateInvoice";

export default function App() {
  
  return (
    <div className="p-6 flex gap-6">
    
    {/* ================= LEFT SIDE (code cũ giữ nguyên) ================= */}
    <div className="w-2/3">
      <CalculateInvoice />
    </div>

    {/* ================= RIGHT SIDE: QUICK CALCULATOR ================= */}
    <div className="w-1/3 bg-white p-6 rounded-xl shadow h-fit">
      <Calculator />
    </div>

  </div>
);
}
