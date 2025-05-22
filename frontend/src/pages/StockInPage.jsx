import { useEffect, useState } from "react";
import { getStockIns, createStockIn, getSpareParts } from "../services/api";
import NavBar from "../components/NavBar";

const StockInPage = () => {
  const [stockIns, setStockIns] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [formValues, setFormValues] = useState({
    stockInID: "",
    sparePartID: "",
    stockInQuantity: 0,
    stockInDate: "",
    receivedBy: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStockIns();
    fetchSpareParts();
  }, []);

  const fetchStockIns = async () => {
    try {
      const response = await getStockIns(token);
      setStockIns(response.data);
    } catch (error) {
      setMessage("Error fetching stock-in records.");
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
      await createStockIn(formValues, token);
      setMessage("Stock-in record added successfully.");
      fetchStockIns();
      setFormValues({
        stockInID: "",
        sparePartID: "",
        stockInQuantity: 0,
        stockInDate: "",
        receivedBy: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.error || "Error adding stock-in record.");
    }
  };

  return (
    <div className="p-8">
      <NavBar />
      <h1 className="text-3xl font-bold mb-6">Stock In</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Stock In</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">StockIn ID</label>
          <input
            type="text"
            value={formValues.stockInID}
            onChange={(e) => setFormValues({ ...formValues, stockInID: e.target.value })}
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
            value={formValues.stockInQuantity}
            onChange={(e) => setFormValues({ ...formValues, stockInQuantity: Number(e.target.value) })}
            required
            className="w-full border px-3 py-2 rounded"
            min={1}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            value={formValues.stockInDate}
            onChange={(e) => setFormValues({ ...formValues, stockInDate: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Received By</label>
          <input
            type="text"
            value={formValues.receivedBy}
            onChange={(e) => setFormValues({ ...formValues, receivedBy: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Stock In
          </button>
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">StockIn ID</th>
              <th className="py-2 px-4 border-b">Spare Part</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Received By</th>
            </tr>
          </thead>
          <tbody>
            {stockIns.map((si) => (
              <tr key={si._id}>
                <td className="py-2 px-4 border-b">{si.stockInID}</td>
                <td className="py-2 px-4 border-b">{si.sparePartID?.name || "-"}</td>
                <td className="py-2 px-4 border-b">{si.stockInQuantity}</td>
                <td className="py-2 px-4 border-b">{si.stockInDate?.slice(0, 10)}</td>
                <td className="py-2 px-4 border-b">{si.receivedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockInPage; 