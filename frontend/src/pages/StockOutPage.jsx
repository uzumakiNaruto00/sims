import { useEffect, useState } from "react";
import { getStockOuts, createStockOut, getSpareParts } from "../services/api";
import NavBar from "../components/NavBar";

const StockOutPage = () => {
  const [stockOuts, setStockOuts] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [formValues, setFormValues] = useState({
    stockOutID: "",
    sparePartID: "",
    stockOutQuantity: 0,
    stockOutDate: "",
    stockOutUnitPrice: 0,
    approvedBy: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStockOuts();
    fetchSpareParts();
  }, []);

  const fetchStockOuts = async () => {
    try {
      const response = await getStockOuts(token);
      setStockOuts(response.data);
    } catch (error) {
      setMessage("Error fetching stock-out records.");
    }
  };

  const fetchSpareParts = async () => {
    try {
      const response = await getSpareParts(token);
      setSpareParts(response.data);
    } catch (error) {
      setMessage("Error fetching spare parts.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStockOut(formValues, token);
      setMessage("Stock-out record added successfully.");
      fetchStockOuts();
      setFormValues({
        stockOutID: "",
        sparePartID: "",
        stockOutQuantity: 0,
        stockOutDate: "",
        stockOutUnitPrice: 0,
        approvedBy: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.error || "Error adding stock-out record.");
    }
  };

  return (
    <div className="p-8">
      <NavBar />
      <h1 className="text-3xl font-bold mb-6">Stock Out</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Stock Out</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">StockOut ID</label>
          <input
            type="text"
            value={formValues.stockOutID}
            onChange={(e) => setFormValues({ ...formValues, stockOutID: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Spare Part</label>
          <select
            value={formValues.sparePartID}
            onChange={(e) => setFormValues({ ...formValues, sparePartID: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Spare Part</option>
            {spareParts.map((sp) => (
              <option key={sp._id} value={sp._id}>
                {sp.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Quantity</label>
          <input
            type="number"
            value={formValues.stockOutQuantity}
            onChange={(e) => setFormValues({ ...formValues, stockOutQuantity: Number(e.target.value) })}
            required
            className="w-full border px-3 py-2 rounded"
            min={1}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            value={formValues.stockOutDate}
            onChange={(e) => setFormValues({ ...formValues, stockOutDate: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Unit Price</label>
          <input
            type="number"
            value={formValues.stockOutUnitPrice}
            onChange={(e) => setFormValues({ ...formValues, stockOutUnitPrice: Number(e.target.value) })}
            required
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Approved By</label>
          <input
            type="text"
            value={formValues.approvedBy}
            onChange={(e) => setFormValues({ ...formValues, approvedBy: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Stock Out
          </button>
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">StockOut ID</th>
              <th className="py-2 px-4 border-b">Spare Part</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Unit Price</th>
              <th className="py-2 px-4 border-b">Total Price</th>
              <th className="py-2 px-4 border-b">Approved By</th>
            </tr>
          </thead>
          <tbody>
            {stockOuts.map((so) => (
              <tr key={so._id}>
                <td className="py-2 px-4 border-b">{so.stockOutID}</td>
                <td className="py-2 px-4 border-b">{so.sparePartID?.name || "-"}</td>
                <td className="py-2 px-4 border-b">{so.stockOutQuantity}</td>
                <td className="py-2 px-4 border-b">{so.stockOutDate?.slice(0, 10)}</td>
                <td className="py-2 px-4 border-b">{so.stockOutUnitPrice}</td>
                <td className="py-2 px-4 border-b">{so.stockOutTotalPrice}</td>
                <td className="py-2 px-4 border-b">{so.approvedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOutPage; 