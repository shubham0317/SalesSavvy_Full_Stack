import { useState } from "react";
import "../cssfiles/CustomModal.css";

function CustomModal({ modalType, data, loading, onSubmit, onClose }) {
  const user = data?.user;
  const [prevUserId, setPrevUserId] = useState(user?.userId);

  const [form, setForm] = useState(() => ({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    productId: "",
    userId: user?.userId ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
    month: "",
    year: "",
    date: "",
  }));

  if (user && user.userId !== prevUserId) {
    setPrevUserId(user.userId);
    setForm((prev) => ({
      ...prev,
      userId: user.userId ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      role: user.role ?? "",
    }));
  }

  const change = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const titleMap = {
    addProduct: "Add Product",
    deleteProduct: "Delete Product",
    viewUser: "View User",
    modifyUser: "Modify User",
    monthlyBusiness: "Monthly Business",
    dailyBusiness: "Daily Business",
    yearlyBusiness: "Yearly Business",
    overallBusiness: "Overall Business",
  };

  const title = titleMap[modalType];

  const renderError = () =>
    data?.error ? (
      <div className="modal-message error">{data.error}</div>
    ) : null;

  const renderSuccess = () =>
    data?.success ? (
      <div className="modal-message success">{data.success}</div>
    ) : null;

  const renderBusiness = (business) => {
    if (!business) return null;
    const total = business.totalBusiness ?? business.totalRevenue ?? 0;

    return (
      <div className="business-result">
        <div className="business-total">
          <span>Total Business</span>
          <strong>₹{Number(total).toFixed(2)}</strong>
        </div>

        <h4>Category Sales</h4>

        {business.categorySales &&
        Object.keys(business.categorySales).length > 0 ? (
          Object.entries(business.categorySales).map(([category, value]) => (
            <div className="category-row" key={category}>
              <span>{category}</span>
              <strong>₹{Number(value || 0).toFixed(2)}</strong>
            </div>
          ))
        ) : (
          <p className="empty-result">No category sales available.</p>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="custom-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="modal-label">ADMIN ACTION</span>
            <h2>{title}</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* ================= ADD PRODUCT ================= */}
          {modalType === "addProduct" && !data?.success && (
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={change}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={change}
                    placeholder="Enter stock"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category ID</label>
                  <input
                    type="number"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={change}
                    placeholder="Enter category ID"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={change}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={change}
                  placeholder="Enter product description"
                  rows="4"
                  required
                />
              </div>

              {renderError()}

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          )}

          {/* ================= DELETE PRODUCT ================= */}
          {modalType === "deleteProduct" && !data?.success && (
            <form onSubmit={submit}>
              <div className="warning-box">
                <span>⚠</span>
                <p>
                  Deleting a product will permanently remove it from the
                  inventory.
                </p>
              </div>

              <div className="form-group">
                <label>Product ID</label>
                <input
                  type="number"
                  name="productId"
                  value={form.productId}
                  onChange={change}
                  placeholder="Enter product ID"
                  min="1"
                  required
                />
              </div>

              {renderError()}

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="btn danger" disabled={loading}>
                  {loading ? "Deleting..." : "Delete Product"}
                </button>
              </div>
            </form>
          )}

          {/* ================= VIEW USER ================= */}
          {modalType === "viewUser" && !data?.user && !data?.error && (
            <form onSubmit={submit}>
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="number"
                  name="userId"
                  value={form.userId}
                  onChange={change}
                  placeholder="Enter user ID"
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? "Fetching..." : "View User"}
                </button>
              </div>
            </form>
          )}

          {modalType === "viewUser" && data?.user && (
            <>
              <div className="user-result">
                <div>
                  <span>User ID</span>
                  <strong>{data.user.userId}</strong>
                </div>

                <div>
                  <span>Username</span>
                  <strong>{data.user.username}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{data.user.email}</strong>
                </div>

                <div>
                  <span>Role</span>
                  <strong>{data.user.role}</strong>
                </div>

                <div>
                  <span>Created At</span>
                  <strong>{data.user.createdAt || "N/A"}</strong>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}

          {/* ================= MODIFY USER ================= */}
          {modalType === "modifyUser" && !data?.user && !data?.error && (
            <form onSubmit={submit}>
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="number"
                  name="userId"
                  value={form.userId}
                  onChange={change}
                  placeholder="Enter user ID"
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? "Fetching..." : "Fetch User"}
                </button>
              </div>
            </form>
          )}

          {modalType === "modifyUser" && data?.user && !data?.success && (
            <form onSubmit={submit}>
              <div className="form-group">
                <label>User ID</label>
                <input
                  value={form.userId}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={change}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={change}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {renderError()}

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          )}

          {/* ================= BUSINESS FORMS ================= */}
          {modalType === "monthlyBusiness" && !data && (
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Month</label>
                  <input
                    type="number"
                    name="month"
                    value={form.month}
                    onChange={change}
                    placeholder="1 - 12"
                    min="1"
                    max="12"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={change}
                    placeholder="2026"
                    min="2000"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button className="btn primary" disabled={loading}>
                  {loading ? "Loading..." : "Get Report"}
                </button>
              </div>
            </form>
          )}

          {modalType === "dailyBusiness" && !data && (
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={change}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button className="btn primary" disabled={loading}>
                  {loading ? "Loading..." : "Get Report"}
                </button>
              </div>
            </form>
          )}

          {modalType === "yearlyBusiness" && !data && (
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={change}
                  placeholder="2026"
                  min="2000"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button className="btn primary" disabled={loading}>
                  {loading ? "Loading..." : "Get Report"}
                </button>
              </div>
            </form>
          )}

          {modalType === "overallBusiness" && !data && (
            <div className="overall-action">
              <p>
                View the complete business report from the beginning of the
                application.
              </p>

              <div className="modal-actions">
                <button className="btn secondary" onClick={onClose}>
                  Cancel
                </button>

                <button
                  className="btn primary"
                  onClick={() => onSubmit({})}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Get Report"}
                </button>
              </div>
            </div>
          )}

          {/* ================= BUSINESS RESULTS ================= */}

          {data?.monthlyBusiness && (
            <>
              {renderBusiness(data.monthlyBusiness)}

              <div className="modal-actions">
                <button className="btn secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}

          {data?.dailyBusiness && (
            <>
              {renderBusiness(data.dailyBusiness)}

              <div className="modal-actions">
                <button className="btn secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}

          {data?.yearlyBusiness && (
            <>
              {renderBusiness(data.yearlyBusiness)}

              <div className="modal-actions">
                <button className="btn secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}

          {data?.overallBusiness && (
            <>
              {renderBusiness(data.overallBusiness)}

              <div className="modal-actions">
                <button className="btn secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}

          {/* ================= SUCCESS ================= */}

          {data?.success && (
            <>
              {renderSuccess()}

              {data.product && (
                <div className="result-card">
                  <p>
                    <strong>Product:</strong>{" "}
                    {data.product.name || "Created successfully"}
                  </p>
                </div>
              )}

              {data.user && (
                <div className="user-result">
                  <div>
                    <span>User ID</span>
                    <strong>{data.user.userId}</strong>
                  </div>

                  <div>
                    <span>Username</span>
                    <strong>{data.user.username}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{data.user.email}</strong>
                  </div>

                  <div>
                    <span>Role</span>
                    <strong>{data.user.role}</strong>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button className="btn primary" onClick={onClose}>
                  Done
                </button>
              </div>
            </>
          )}

          {/* ================= ERROR ================= */}

          {data?.error && (
            <>
              {renderError()}

              <div className="modal-actions">
                <button className="btn secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomModal;