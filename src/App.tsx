import { useState } from "react";
import { Tooltip, InputNumber, type InputNumberProps } from 'antd';

interface Item {
  name: string;
  price: number | string;
  qty: number | string;
  discount: number | string; // %
}

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { name: "", price: "", qty: "", discount: "" },
  ]);

  const [billDiscount, setBillDiscount] = useState<number | string>("");

  const updateItem = (index: number, key: keyof Item, value: string) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: "", qty: "", discount: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Convert safely to number
  const toNum = (value: number | string): number =>
    value === "" ? 0 : Number(value);

  const subtotal = items.reduce(
    (sum, item) => sum + toNum(item.price) * toNum(item.qty),
    0
  );

  const productDiscount = items.reduce(
    (sum, item) =>
      sum +
      toNum(item.price) *
        toNum(item.qty) *
        (toNum(item.discount) / 100),
    0
  );

  const afterProductDiscount = subtotal - productDiscount;

  const billDiscountAmount =
    afterProductDiscount * (toNum(billDiscount) / 100);

  const grandTotal = afterProductDiscount - billDiscountAmount;

  const formatter: InputNumberProps<number>['formatter'] = (value) => {
      const [start, end] = `${value}`.split('.') || [];
      const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `$ ${end ? `${v}.${end}` : `${v}`}`;
    };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Tính toán đơn hàng</h1>

        {/* ITEM LIST */}
        <div className="flex border rounded-xl bg-gray-50 shadow-sm justify-between">
          <div className="flex-1 p-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-xl bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">{item.name + " " + (idx + 1)}</h2>
                {idx > 0 && (
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* ONE LINE INPUT */}
              <div className="grid grid-cols-3 gap-3">
                {/* Price */}
                <div>
                  <Tooltip title="Giá gốc của sản phẩm">
                    <label className="text-sm">Giá Gốc</label>
                  </Tooltip>
                  
                  <InputNumber<number>
                    style={{ width: '100%' }}
                    formatter={formatter}
                    className="w-full border rounded px-2 py-1 mt-1"
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    onChange={(e) =>
                                    updateItem(idx, "price", e?.toString() ?? "")
                                  }
                  />
                </div>

                {/* Qty */}
                <div className="flex flex-col">
                  <label className="text-sm">Số lượng</label>                

                  <InputNumber<number>
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    className="border rounded px-2 py-1"
                    parser={(value) => value?.replace('%', '') as unknown as number}
                    onChange={(e) =>
                      updateItem(idx, "qty", e?.toString() ?? "")
                    }
                  />
                </div>

                {/* Discount */}
                <div>
                  <Tooltip title="% Discount cho mỗi sản phẩm">
                    <label className="text-sm">Discount/SP (%)</label>
                  </Tooltip>
                  
                  <InputNumber<number>
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    className="w-full border rounded px-2 py-1 mt-1"
                    formatter={(value) => `${value}%`}
                    parser={(value) => value?.replace('%', '') as unknown as number}
                    onChange={(e) =>
                      updateItem(idx, "discount", e?.toString() ?? "")
                    }
                  />
                </div>
                
              </div>
            </div>
          ))}
          </div>
          <div className="space-y-4 mt-7 p-5">
            <button
              onClick={addItem}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Thêm
            </button>
          </div>
        </div>        

        {/* BILL DISCOUNT */}
        <div className="mt-6">
          <label className="text-sm font-semibold">
            Discount trên tổng bill (%)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-32 border rounded px-2 py-1 ml-2"
            value={billDiscount}
            onChange={(e) => setBillDiscount(e.target.value)}
          />
        </div>

        {/* SUMMARY */}
        <div className="mt-8 p-4 bg-gray-50 border rounded-xl shadow-inner">
          <p>
            Tạm tính: <b>{subtotal.toLocaleString()} đ</b>
          </p>
          <p>
            Giảm giá từng SP: <b>{productDiscount.toLocaleString()} đ</b>
          </p>
          <p>
            Sau giảm giá SP:{" "}
            <b>{afterProductDiscount.toLocaleString()} đ</b>
          </p>
          <p>
            Giảm giá toàn bill:{" "}
            <b>{billDiscountAmount.toLocaleString()} đ</b>
          </p>

          <h2 className="text-xl font-bold mt-4">
            Tổng thanh toán: {grandTotal.toLocaleString()} đ
          </h2>
        </div>
      </div>
    </div>
  );
}
