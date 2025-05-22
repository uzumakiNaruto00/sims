import { useEffect, useState } from "react";
import {
  getSpareParts,
  createSparePart,
  updateSparePart,
  deleteSparePart,
} from "../services/api";
import NavBar from "../components/NavBar";

const SparePartPage = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "edit"
  const [selectedSparePart, setSelectedSparePart] = useState(null);
  const [formValues, setFormValues] = useState({
    sparePartID: "",
    name: "",
    category: "",
    unitPrice: 0,
    quantity: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const response = await getSpareParts(token);
      setSpareParts(response.data);
    } catch (error) {
      setMessage("Error fetching spare parts.");
    }
  };

  const handleAdd = async () => {
    try {
      await createSparePart(formValues, token);
      setMessage("Spare part added successfully.");
      fetchSpareParts();
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error adding spare part.");
    }
  };

  const handleEdit = async () => {
    try {
      await updateSparePart(selectedSparePart._id, formValues, token);
      setMessage("Spare part updated successfully.");
      fetchSpareParts();
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating spare part.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this spare part?")) {
      try {
        await deleteSparePart(id, token);
        setMessage("Spare part deleted successfully.");
        fetchSpareParts();
      } catch (error) {
        setMessage(error.response?.data?.error || "Error deleting spare part.");
      }
    }
  };

  const openModal = (sparePart = null, type) => {
    setSelectedSparePart(sparePart);
    setModalType(type);
    setFormValues(
      sparePart || {
        sparePartID: "",
        name: "",
        category: "",
        unitPrice: 0,
        quantity: 0,
      }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSparePart(null);
    setFormValues({
      sparePartID: "",
      name: "",
      category: "",
      unitPrice: 0,
      quantity: 0,
    });
    setModalType("");
  };

  return (
    <div className="p-8">
      <NavBar />

      {message && <p className="text-green-500 mb-4">{message}</p>}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal(null, "add")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Spare Part
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">SparePart ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Unit Price</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Total Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {spareParts.map((sp) => (
              <tr key={sp._id}>
                <td className="py-2 px-4 border-b">{sp.sparePartID}</td>
                <td className="py-2 px-4 border-b">{sp.name}</td>
                <td className="py-2 px-4 border-b">{sp.category}</td>
                <td className="py-2 px-4 border-b">{sp.unitPrice}</td>
                <td className="py-2 px-4 border-b">{sp.quantity}</td>
                <td className="py-2 px-4 border-b">{sp.totalPrice}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openModal(sp, "edit")}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sp._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add New Spare Part" : "Edit Spare Part"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                modalType === "add" ? handleAdd() : handleEdit();
              }}
            >
              <div className="mb-4">
                <label className="block font-semibold mb-1">SparePart ID</label>
                <input
                  type="text"
                  value={formValues.sparePartID}
                  onChange={(e) => setFormValues({ ...formValues, sparePartID: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                  disabled={modalType === "edit"}
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={formValues.category}
                  onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Unit Price</label>
                <input
                  type="number"
                  value={formValues.unitPrice}
                  onChange={(e) => setFormValues({ ...formValues, unitPrice: Number(e.target.value) })}
                  required
                  className="w-full border px-3 py-2 rounded"
                  min={0}
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  value={formValues.quantity}
                  onChange={(e) => setFormValues({ ...formValues, quantity: Number(e.target.value) })}
                  required
                  className="w-full border px-3 py-2 rounded"
                  min={0}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {modalType === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SparePartPage; 