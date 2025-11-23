import { useState } from "react";
import { InputNumber, type InputNumberProps, Button, Input } from 'antd';

interface Item {
  name: string;
  price: number | string;
  qty: number | string;
  discount: number | string; // %
  totalDiscount: number | string;
  total: number | string;
}

const CalculateInvoice = () => {
    const [items, setItems] = useState<Item[]>([
    { name: "", price: "", qty: 0, discount: "", totalDiscount: "", total: "" },
  ]);

  const [billDiscount, setBillDiscount] = useState<number | string>("");
  const [billDiscountPrice, setBillDiscountPrice] = useState<number | string>("");

  const updateItem = (index: number, key: keyof Item, value: string) => {
    const newItems = [...items];
    newItems[index][key] = value;

    // Calculate total
    const price = toNum(newItems[index].price);
    const qty = toNum(newItems[index].qty);
    
    const totalDiscount = toNum(newItems[index].totalDiscount);    

    if(key === 'totalDiscount' || key === 'discount') {
      if(key === 'totalDiscount')
      {
        newItems[index].discount = ((totalDiscount / (price * qty)) * 100).toFixed(2);
      }

      const discount = toNum(newItems[index].discount);
      if(key === 'discount') {
      newItems[index].totalDiscount = price * qty * (discount / 100);
      }
    }
    
    else
    {
      newItems[index].discount = ((totalDiscount / (price * qty)) * 100).toFixed(2);
      newItems[index].totalDiscount = price * qty * ((toNum(newItems[index].discount)) / 100);
    }
    
    newItems[index].total = price * qty - toNum(newItems[index].totalDiscount);

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: "", qty: 1, discount: "", totalDiscount: "", total: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const clear = () => {
    setItems([{ name: "", price: "", qty: 0, discount: "", totalDiscount: "", total: "" }]);
    setBillDiscount("");
    setBillDiscountPrice("");
  }

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

  const totalPrice = items.reduce(
    (sum, item) =>
      sum +
      toNum(item.total),
    0
  );

  const totalProductDiscount = items.reduce(
    (sum, item) =>
      sum +
      toNum(item.totalDiscount),
    0
  );

  const afterProductDiscount = subtotal - productDiscount;

  const billPercentDiscount = toNum(billDiscount);
  const billDiscountPriceNum = toNum(billDiscountPrice);

  const billDiscountAmount = billPercentDiscount > 0 ? afterProductDiscount * (billPercentDiscount / 100) : billDiscountPriceNum;

  const total = totalPrice - billDiscountAmount;

  const formatter: InputNumberProps<number>['formatter'] = (value) => {
      const [start, end] = `${value}`.split('.') || [];
      const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `${end ? `${v}.${end}` : `${v}`}`;
    };
    return (
        <div>
            <div className="min-h-screen bg-gray-100 p-8">
              <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
                <h1 className="text-3xl font-bold mb-8 text-gray-700">Tính toán đơn hàng</h1>

            {/* ITEM LIST */}
            <div className="border border-gray-300 rounded-xl bg-gray-50 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Danh sách sản phẩm</h2>

                {items.find((item) => item.price !== "" && toNum(item.price) > 0) && (
                  <Button
                    type="primary" 
                    danger
                    onClick={clear}
                    className="px-4 py-2 rounded-md shadow text-white hover:bg-teal-600"
                  >
                    Clear
                  </Button>
                )}
                
        
                <Button
                  color="cyan"
                  variant="solid"
                  onClick={addItem}
                  className="px-4 py-2 rounded-md shadow bg-teal-500 text-white hover:bg-teal-600"
                >
                  + Thêm sản phẩm
                </Button>

                
              </div>
        
              {/* Item Blocks */}
              <div className="space-y-6">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700 text-lg">
                      Sản phẩm {idx + 1}
                    </h3>
              
                    {idx > 0 && (
                      <Button
                        onClick={() => removeItem(idx)}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded-md shadow hover:bg-red-600"
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                  
                  {/* Input row */}
                  <div className="grid grid-cols-5 gap-6">
                    {/* Price */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Giá Gốc (VND)
                      </label>
                  
                      <InputNumber<number>
                        style={{ width: "100%" }}
                        formatter={formatter}
                        value={toNum(item.price)}
                        className="mt-1 w-full"
                        min={0}
                        onChange={(e) =>
                          updateItem(idx, "price", e?.toString() ?? "")
                        }
                      />
                    </div>
                      
                    {/* Qty */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Số lượng
                      </label>
                      
                      <InputNumber<number>
                        min={0}
                        max={100}
                        value={toNum(item.qty)}
                        style={{ width: "100%" }}
                        className="mt-1 w-full"
                        onChange={(e) =>
                          updateItem(idx, "qty", e?.toString() ?? "")
                        }
                      />
                    </div>
                      
                    {/* Discount (%) */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Discount (%)
                      </label>
                      
                      <InputNumber<number>
                        style={{ width: "100%" }}
                        min={0}
                        max={100}
                        value={toNum(item.discount)}
                        className="mt-1 w-full"
                        formatter={(v) => `${v}%`}
                        parser={(v) => v?.replace("%", "") as unknown as number}
                        onChange={(e) =>
                          updateItem(idx, "discount", e?.toString() ?? "")
                        }
                      />
                    </div>
                      
                    {/* Total Discount */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Tổng discount (VND)
                      </label>
                      
                      <InputNumber<number>
                        style={{ width: "100%" }}
                        value={toNum(item.totalDiscount)}
                        formatter={formatter}
                        className="mt-1 w-full"
                        onChange={(e) =>
                          updateItem(idx, "totalDiscount", e?.toString() ?? "")
                        }
                      />
                    </div>
                      
                    {/* Total Price */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Tổng tiền (VND)
                      </label>
                      
                      <Input
                        value={item.total.toLocaleString()}
                        disabled
                        style={{ width: "100%" }}
                        className="mt-1 w-full bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
            
                {/* BILL DISCOUNT */}
                <div className="mt-8 flex justify-center items-center gap-6">
                    {/* % */}
                    <div>
                      <label className="text-sm font-medium text-gray-600 pl-2">
                        Discount (%) toàn bill
                      </label>
                      <InputNumber<number>
                        min={0}
                        max={100}
                        style={{ width: "120px" }}
                        value={toNum(billDiscount)}
                        className="mt-1"
                        formatter={(v) => `${v}%`}
                        parser={(v) => v?.replace("%", "") as unknown as number}
                        onChange={(e) => {
                          setBillDiscount(e?.toString() ?? "");
                          setBillDiscountPrice(0);
                        }}
                      />
                    </div>
              
                    <span className="text-gray-500 text-sm">Hoặc</span>
              
            {/* VND */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Discount (VND)
              </label>
              
              <InputNumber<number>
                style={{ width: "150px" }}
                value={toNum(billDiscountPrice)}
                formatter={formatter}
                className="mt-1"
                onChange={(e) => {
                  setBillDiscount(0);
                  setBillDiscountPrice(e?.toString() ?? "");
                }}
              />
            </div>
                </div>
              
                {/* SUMMARY */}
                <div className="mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="space-y-2 text-gray-700 text-sm">
                      <p>
                        Tổng giá gốc: <b>{subtotal.toLocaleString()}</b>
                      </p>
                      <p>
                        Tổng giá gốc sau discount: <b>{totalPrice.toLocaleString()}</b>
                      </p>
                      <p>
                        Tổng discount giá từ sản phẩm: <b>{totalProductDiscount.toLocaleString()}</b>
                      </p>
                      <p>
                        Tổng discount giá toàn bill:{" "}
                        <b>{billDiscountAmount.toLocaleString()}</b>
                      </p>
                    </div>
                    <h2 className="text-2xl font-bold mt-4 text-red-600">
                      Tổng thanh toán: {total.toLocaleString()}
                    </h2>
                </div>
              </div>
            </div>
        </div>
    )
}

export default CalculateInvoice