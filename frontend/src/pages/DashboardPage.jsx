import { useEffect, useState } from "react";
import { getSpareParts, getStockIns, getStockOuts } from "../services/api";
import NavBar from "../components/NavBar";

const DashboardPage = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [stockIns, setStockIns] = useState([]);
  const [stockOuts, setStockOuts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [spRes, inRes, outRes] = await Promise.all([
        getSpareParts(token),
        getStockIns(token),
        getStockOuts(token),
      ]);
      setSpareParts(spRes.data);
      setStockIns(inRes.data);
      setStockOuts(outRes.data);
    } catch (error) {
      // handle error
    }
  };

  // Prepare history (merge and sort by date desc)
  const history = [
    ...stockIns.map((si) => ({
      type: "IN",
      date: si.stockInDate,
      sparePart: si.sparePartID?.name || "-",
      quantity: si.stockInQuantity,
      user: si.receivedBy,
    })),
    ...stockOuts.map((so) => ({
      type: "OUT",
      date: so.stockOutDate,
      sparePart: so.sparePartID?.name || "-",
      quantity: so.stockOutQuantity,
      user: so.approvedBy,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-8">
      <NavBar />
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded shadow p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Total Spare Parts</h2>
          <p className="text-3xl font-bold">{spareParts.length}</p>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Total Stock In</h2>
          <p className="text-3xl font-bold">{stockIns.length}</p>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Total Stock Out</h2>
          <p className="text-3xl font-bold">{stockOuts.length}</p>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Stock History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Spare Part</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">User</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 20).map((h, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-4 border-b">{h.type}</td>
                  <td className="py-2 px-4 border-b">{h.date?.slice(0, 10)}</td>
                  <td className="py-2 px-4 border-b">{h.sparePart}</td>
                  <td className="py-2 px-4 border-b">{h.quantity}</td>
                  <td className="py-2 px-4 border-b">{h.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 