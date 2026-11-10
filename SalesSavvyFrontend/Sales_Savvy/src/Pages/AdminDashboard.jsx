import { useState } from "react";
import CustomModal from "../components/CustomModal";
import "../cssfiles/AdminDashboard.css";
import AdminHeader from "../components/AdminHeader";
import {
  addProduct,
  //deleteProduct,
  getUserById,
  modifyUser,
  getMonthlyBusiness,
  getDailyBusiness,
  getYearlyBusiness,
  getOverallBusiness,
} from "../services/adminApi";

const cards = [
  {
    title: "Add Product",
    description: "Create a new product and add it to inventory",
    team: "Product Management",
    icon: "+",
    type: "addProduct",
  },
  // {
  //   title: "Delete Product",
  //   description: "Remove an existing product from inventory",
  //   team: "Product Management",
  //   icon: "×",
  //   type: "deleteProduct",
  // },
  {
    title: "View User",
    description: "Fetch details of a specific user",
    team: "User Management",
    icon: "☰",
    type: "viewUser",
  },
  {
    title: "Modify User",
    description: "Update user details and manage roles",
    team: "User Management",
    icon: "✎",
    type: "modifyUser",
  },
  {
    title: "Monthly Business",
    description: "View revenue for a specific month",
    team: "Business Analytics",
    icon: "▤",
    type: "monthlyBusiness",
  },
  {
    title: "Daily Business",
    description: "View daily revenue and sales",
    team: "Business Analytics",
    icon: "▥",
    type: "dailyBusiness",
  },
  {
    title: "Yearly Business",
    description: "View yearly revenue and sales",
    team: "Business Analytics",
    icon: "▥",
    type: "yearlyBusiness",
  },
  {
    title: "Overall Business",
    description: "View total revenue since inception",
    team: "Business Analytics",
    icon: "₹",
    type: "overallBusiness",
  },
];

function AdminDashboard() {
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setModalData(null);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
    setLoading(false);
  };

  const showError = (message) => {
    setModalData({ error: message });
  };

  // ---------------- ADD PRODUCT ----------------
  const handleAddProduct = async (data) => {
    try {
      setLoading(true);
      const res = await addProduct({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: Number(data.categoryId),
        imageUrl: data.imageUrl,
      });

      if (!res.ok) {
        showError(res.error || "Unable to add product");
        return;
      }

      setModalData({
        success: "Product added successfully.",
        product: res.data,
      });
    } catch (error) {
      console.error(error);
      showError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE PRODUCT ----------------
  // const handleDeleteProduct = async (data) => {
  //   try {
  //     setLoading(true);
  //     const res = await deleteProduct(data.productId);

  //     if (!res.ok) {
  //       showError(res.error || "Unable to delete product");
  //       return;
  //     }

  //     setModalData({
  //       success: typeof res.data === "string" ? res.data : "Product deleted successfully.",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     showError("Unable to connect to server.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ---------------- VIEW USER ----------------
  const handleViewUser = async (data) => {
    try {
      setLoading(true);
      const res = await getUserById(data.userId);

      if (!res.ok) {
        showError(res.error || "User not found");
        return;
      }

      setModalData({ user: res.data });
    } catch (error) {
      console.error(error);
      showError("Unable to fetch user.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- MODIFY USER ----------------
  const handleModifyUser = async (data) => {
    try {
      setLoading(true);

      // First step: fetch user
      if (!data.username) {
        const res = await getUserById(data.userId);

        if (!res.ok) {
          showError(res.error || "User not found");
          return;
        }

        setModalData({ user: res.data });
        return;
      }

      // Second step: update user
      const res = await modifyUser({
        userId: Number(data.userId),
        username: data.username,
        email: data.email,
        role: data.role,
      });

      if (!res.ok) {
        showError(res.error || "Unable to update user");
        return;
      }

      setModalData({
        success: "User updated successfully.",
        user: res.data,
      });
    } catch (error) {
      console.error(error);
      showError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- MONTHLY BUSINESS ----------------
  const handleMonthlyBusiness = async (data) => {
    try {
      setLoading(true);
      const res = await getMonthlyBusiness(data.month, data.year);

      if (!res.ok) {
        showError(res.error || "Unable to fetch monthly business");
        return;
      }

      setModalData({ monthlyBusiness: res.data });
    } catch (error) {
      console.error(error);
      showError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DAILY BUSINESS ----------------
  const handleDailyBusiness = async (data) => {
    try {
      setLoading(true);
      const res = await getDailyBusiness(data.date);

      if (!res.ok) {
        showError(res.error || "Unable to fetch daily business");
        return;
      }

      setModalData({ dailyBusiness: res.data });
    } catch (error) {
      console.error(error);
      showError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- YEARLY BUSINESS ----------------
  const handleYearlyBusiness = async (data) => {
    try {
      setLoading(true);
      const res = await getYearlyBusiness(data.year);

      if (!res.ok) {
        showError(res.error || "Unable to fetch yearly business");
        return;
      }

      setModalData({ yearlyBusiness: res.data });
    } catch (error) {
      console.error(error);
      showError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- OVERALL BUSINESS ----------------
  const handleOverallBusiness = async () => {
    try {
      setLoading(true);
      const res = await getOverallBusiness();

      if (!res.ok) {
        showError(res.error || "Unable to fetch business");
        return;
      }

      setModalData({ overallBusiness: res.data });
    } catch (error) {
      console.error(error);
      showError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (data) => {
    switch (modalType) {
      case "addProduct":
        handleAddProduct(data);
        break;

      case "deleteProduct":
        handleDeleteProduct(data);
        break;

      case "viewUser":
        handleViewUser(data);
        break;

      case "modifyUser":
        handleModifyUser(data);
        break;

      case "monthlyBusiness":
        handleMonthlyBusiness(data);
        break;

      case "dailyBusiness":
        handleDailyBusiness(data);
        break;

      case "yearlyBusiness":
        handleYearlyBusiness(data);
        break;

      case "overallBusiness":
        handleOverallBusiness();
        break;

      default:
        break;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <main className="dashboard-content">
        <div className="dashboard-heading">
          <span>ADMIN PANEL</span>
          <h1>Admin Dashboard</h1>
          <p>Manage products, users and business analytics</p>
        </div>

        <div className="cards-grid">
          {cards.map((card) => (
            <button
              className="admin-card"
              key={card.type}
              onClick={() => openModal(card.type)}
            >
              <div className="card-icon">{card.icon}</div>

              <div className="card-content">
                <span className="card-team">{card.team}</span>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>

              <span className="card-arrow">→</span>
            </button>
          ))}
        </div>
      </main>

      {modalType && (
        <CustomModal
          modalType={modalType}
          data={modalData}
          loading={loading}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default AdminDashboard;