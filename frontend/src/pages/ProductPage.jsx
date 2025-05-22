import { useEffect, useState } from "react";
import {
  getProducts,
  stockInProduct,
  stockOutProduct,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../services/api";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "stock-in", "stock-out", "update", "create"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", stock: 0 }); // Form for update/create
  const [stockQuantity, setStockQuantity] = useState(0); // Stock value entered for stock in/out
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts(token);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching products.");
    }
  };

  const handleCreate = async () => {
    try {
      await createProduct(formValues, token);
      setMessage("Product created successfully.");
      fetchProducts();
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error creating product.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProduct(selectedProduct._id, formValues, token);
      setMessage("Product updated successfully.");
      fetchProducts();
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating product.");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId, token);
        setMessage("Product deleted successfully.");
        fetchProducts();
      } catch (error) {
        setMessage(error.response?.data?.error || "Error deleting product.");
      }
    }
  };

  const handleStockIn = async () => {
    try {
      if (!stockQuantity || isNaN(stockQuantity) || stockQuantity <= 0) {
        setMessage("Please enter a valid stock quantity.");
        return;
      }

      await stockInProduct(selectedProduct._id, { stock: stockQuantity }, token);

      setMessage("Stock added successfully.");
      fetchProducts();
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error adding stock.");
    }
  };

  const handleStockOut = async () => {
    try {
      if (!stockQuantity || isNaN(stockQuantity) || stockQuantity <= 0) {
        setMessage("Please enter a valid stock quantity.");
        return;
      }

      await stockOutProduct(selectedProduct._id, { stock: stockQuantity }, token);
      setMessage("Stock removed successfully.");
      fetchProducts();
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error removing stock.");
    }
  };

  const openModal = (product = null, type) => {
    setSelectedProduct(product);
    setModalType(type);
    setFormValues(product || { name: "", stock: 0 });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setStockQuantity(0);
    setFormValues({ name: "", stock: 0 });
    setModalType("");
  };

  return (
    <div className="p-8">
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex items-center">
          <p className="mr-4">Welcome, Admin {localStorage.getItem("username")}!</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              window.location.href = "/";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {message && <p className="text-green-500 mb-4">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4 relative">
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-4">Stock: {product.stock}</p>
            <div className="flex justify-between">
              <button
                onClick={() => openModal(product, "stock-in")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Stock In
              </button>
              <button
                onClick={() => openModal(product, "stock-out")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Stock Out
              </button>
            </div>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => openModal(product, "update")}
                className="text-gray-600 hover:text-blue-500"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="text-gray-600 hover:text-red-500"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        <div
          onClick={() => openModal(null, "create")}
          className="bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <i className="fas fa-plus text-4xl text-green-500"></i>
          <p className="mt-2 text-gray-600">Add Product</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            {modalType === "create" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreate();
                  }}
                >
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Stock</label>
                    <input
                      type="text"
                      min="0"
                      value={formValues.stock}
                      onChange={(e) =>
                        setFormValues({ ...formValues, stock: Number(e.target.value) })
                      }
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modalType === "update" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Update Product</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                  }}
                >
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Stock</label>
                    <input
                      type="text"
                      min="0"
                      value={formValues.stock}
                      onChange={(e) =>
                        setFormValues({ ...formValues, stock: Number(e.target.value) })
                      }
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {(modalType === "stock-in" || modalType === "stock-out") && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  {modalType === "stock-in" ? "Add Stock" : "Remove Stock"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    modalType === "stock-in" ? handleStockIn() : handleStockOut();
                  }}
                >
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Quantity</label>
                    <input
                      type="text"
                      min="1"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={`${
                        modalType === "stock-in"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white px-4 py-2 rounded mr-2`}
                    >
                      {modalType === "stock-in" ? "Add" : "Remove"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
