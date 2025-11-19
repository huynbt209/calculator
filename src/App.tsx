import Calculator from "./Calculator";
import CalculateInvoice from "./CalculateInvoice";

export default function App() {
  
  return (
    <div className="p-6 flex">
    
    {/* ================= LEFT SIDE (code cũ giữ nguyên) ================= */}
    <div className="w-7/10">
      <CalculateInvoice />
    </div>

    {/* ================= RIGHT SIDE: QUICK CALCULATOR ================= */}
    <div className="w-3/10 bg-white p-6 rounded-xl shadow h-fit">
      <Calculator />
    </div>

  </div>
);
}
