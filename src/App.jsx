
import React, { useState } from "react";
import "./App.css";

const initialProducts = [
  {
    id: 1,
    name: "Premium Laptop",
    price: 40000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    category: "Electronics",
    seller: "AuctionHub Store",
    description: "Laptop listing submitted for admin review.",
    condition: "Used",
    proofUrl: "",
    verificationStatus: "pending",
  },
  {
    id: 2,
    name: "Smartphone",
    price: 20000,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    category: "Electronics",
    seller: "AuctionHub Store",
    description: "Smartphone listing submitted for admin review.",
    condition: "Used",
    proofUrl: "",
    verificationStatus: "pending",
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 5000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    category: "Accessories",
    seller: "AuctionHub Store",
    description: "Smart watch listing submitted for admin review.",
    condition: "Used",
    proofUrl: "",
    verificationStatus: "pending",
  },
];

function readStorage(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [page, setPage] = useState("home");

  const [users, setUsers] = useState(() =>
    readStorage("auctionUsers", [])
  );

  const [products, setProducts] = useState(() => {
    const savedProducts = readStorage("auctionProducts", null);
    const source = Array.isArray(savedProducts)
      ? savedProducts
      : initialProducts;

    const migratedProducts = source.map((product) => ({
      ...product,
      seller: product.seller || "AuctionHub Store",
      description: product.description || "No description provided.",
      condition: product.condition || "Used",
      proofUrl: product.proofUrl || "",
      verificationStatus: product.verificationStatus || "pending",
    }));

    localStorage.setItem(
      "auctionProducts",
      JSON.stringify(migratedProducts)
    );

    return migratedProducts;
  });

  const [bids, setBids] = useState(() =>
    readStorage("auctionBids", [])
  );

  const [notifications, setNotifications] = useState(() =>
    readStorage("auctionNotifications", [])
  );

  const [reports, setReports] = useState(() =>
    readStorage("auctionReports", [])
  );

  const [loggedInUser, setLoggedInUser] = useState(
    () => localStorage.getItem("loggedInUser") || ""
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newSellerName, setNewSellerName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductCondition, setNewProductCondition] = useState("New");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductProof, setNewProductProof] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  const [reportProduct, setReportProduct] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const [message, setMessage] = useState("");

  const approvedProducts = products.filter(
    (product) => product.verificationStatus === "approved"
  );

  const userBids = bids.filter(
    (bid) => bid.bidder === loggedInUser
  );

  function saveProducts(updatedProducts) {
    setProducts(updatedProducts);
    localStorage.setItem(
      "auctionProducts",
      JSON.stringify(updatedProducts)
    );
  }

  function saveBids(updatedBids) {
    setBids(updatedBids);
    localStorage.setItem("auctionBids", JSON.stringify(updatedBids));
  }

  function saveNotifications(updatedNotifications) {
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "auctionNotifications",
      JSON.stringify(updatedNotifications)
    );
  }

  function saveReports(updatedReports) {
    setReports(updatedReports);
    localStorage.setItem(
      "auctionReports",
      JSON.stringify(updatedReports)
    );
  }

  function handleSignup(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill in all fields.");
      return;
    }

    const existingUser = users.find(
      (user) => user.email === form.email
    );

    if (existingUser) {
      setMessage("An account with this email already exists.");
      return;
    }

    const updatedUsers = [...users, form];

    setUsers(updatedUsers);
    localStorage.setItem(
      "auctionUsers",
      JSON.stringify(updatedUsers)
    );

    setMessage("Account created successfully! Please log in.");
    setForm({ name: "", email: "", password: "" });
    setPage("login");
  }

  function handleLogin(e) {
    e.preventDefault();

    const foundUser = users.find(
      (user) =>
        user.email === form.email &&
        user.password === form.password
    );

    if (!foundUser) {
      setMessage("Invalid email or password.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", foundUser.name);

    setLoggedInUser(foundUser.name);
    setMessage("");
    setForm({ name: "", email: "", password: "" });
    setPage("dashboard");
  }

  function handleAdminLogin(e) {
    e.preventDefault();

    if (
      adminEmail === "jahnavisudhakanneganti@gmail.com" &&
      adminPassword === "12345"
    ) {
      localStorage.setItem("isAdminLoggedIn", "true");
      setMessage("");
      setPage("adminDashboard");
    } else {
      setMessage("Invalid admin credentials.");
    }
  }

  function handleAddProduct(e) {
    e.preventDefault();

    if (
      !newProductName.trim() ||
      !newProductPrice ||
      !newSellerName.trim() ||
      !newProductDescription.trim() ||
      !newProductImage.trim() ||
      !newProductProof.trim()
    ) {
      setMessage("Please fill in all product details and proof link.");
      return;
    }

    if (
      !newProductImage.startsWith("http://") &&
      !newProductImage.startsWith("https://")
    ) {
      setMessage("Enter a valid product image URL.");
      return;
    }

    if (
      !newProductProof.startsWith("http://") &&
      !newProductProof.startsWith("https://")
    ) {
      setMessage("Enter a valid proof document URL.");
      return;
    }

    if (Number(newProductPrice) <= 0) {
      setMessage("Enter a valid product price.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: newProductName.trim(),
      price: Number(newProductPrice),
      seller: newSellerName.trim(),
      description: newProductDescription.trim(),
      condition: newProductCondition,
      image: newProductImage.trim(),
      proofUrl: newProductProof.trim(),
      category: "General",
      verificationStatus: "pending",
    };

    saveProducts([...products, newProduct]);

    saveNotifications([
      ...notifications,
      {
        id: Date.now(),
        text: `${newProduct.name} has been submitted for admin verification.`,
      },
    ]);

    setNewProductName("");
    setNewProductPrice("");
    setNewSellerName("");
    setNewProductDescription("");
    setNewProductCondition("New");
    setNewProductImage("");
    setNewProductProof("");

    setMessage("Product submitted. It is waiting for admin verification.");
  }

  function handleDeleteProduct(productId) {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );

    saveProducts(updatedProducts);
    setMessage("Product deleted successfully.");
  }

  function handleVerifyProduct(productId, status) {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, verificationStatus: status }
        : product
    );

    saveProducts(updatedProducts);

    const product = products.find((item) => item.id === productId);

    if (product) {
      saveNotifications([
        ...notifications,
        {
          id: Date.now(),
          text: `${product.name} was ${status} by the admin.`,
        },
      ]);
    }

    setMessage(
      status === "approved"
        ? "Product approved. It is now visible to customers."
        : "Product rejected. It will not be shown to customers."
    );
  }

  function handleReportProduct(e) {
    e.preventDefault();

    if (!reportProduct || !reportReason || !reportDetails.trim()) {
      setMessage("Please select a reason and enter the complaint details.");
      return;
    }

    const alreadyReported = reports.some(
      (report) =>
        report.productId === reportProduct.id &&
        report.reportedBy === loggedInUser &&
        report.status === "Pending Review"
    );

    if (alreadyReported) {
      setMessage("You already have a pending report for this product.");
      setReportProduct(null);
      return;
    }

    const newReport = {
      id: Date.now(),
      productId: reportProduct.id,
      productName: reportProduct.name,
      reportedBy: loggedInUser,
      reason: reportReason,
      details: reportDetails.trim(),
      date: new Date().toLocaleString(),
      status: "Pending Review",
    };

    saveReports([...reports, newReport]);

    setReportProduct(null);
    setReportReason("");
    setReportDetails("");
    setMessage("Your complaint has been submitted to the admin.");
  }

  function handleResolveReport(reportId) {
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? { ...report, status: "Reviewed" }
        : report
    );

    saveReports(updatedReports);
    setMessage("Report marked as reviewed.");
  }

  function handleBid(e) {
    e.preventDefault();

    if (!selectedProduct) return;

    const currentProduct = products.find(
      (product) => product.id === selectedProduct.id
    );

    if (
      !currentProduct ||
      currentProduct.verificationStatus !== "approved"
    ) {
      setMessage("This product is not available for bidding.");
      setSelectedProduct(null);
      return;
    }

    const amount = Number(bidAmount);

    if (!amount || amount <= currentProduct.price) {
      setMessage("Your bid must be higher than the current price.");
      return;
    }

    const newBid = {
      id: Date.now(),
      productId: currentProduct.id,
      productName: currentProduct.name,
      bidder: loggedInUser,
      amount,
      date: new Date().toLocaleString(),
    };

    saveBids([...bids, newBid]);

    const updatedProducts = products.map((product) =>
      product.id === currentProduct.id
        ? { ...product, price: amount }
        : product
    );

    saveProducts(updatedProducts);

    saveNotifications([
      ...notifications,
      {
        id: Date.now(),
        text: `Your bid of ₹${amount.toLocaleString("en-IN")} was placed on ${currentProduct.name}.`,
      },
    ]);

    setSelectedProduct(null);
    setBidAmount("");
    setMessage("Your bid has been placed successfully!");
  }

  function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isAdminLoggedIn");

    setLoggedInUser("");
    setMessage("");
    setPage("home");
  }

  function openBidForm(product) {
    setSelectedProduct(product);
    setBidAmount("");
    setMessage("");
  }

  function openReportForm(product) {
    setReportProduct(product);
    setReportReason("");
    setReportDetails("");
    setMessage("");
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2 className="logo" onClick={() => setPage("home")}>
          AuctionHub
        </h2>

        <div className="nav-links">
          <button onClick={() => setPage("home")}>Home</button>

          {loggedInUser ? (
            <>
              <button onClick={() => setPage("dashboard")}>
                Dashboard
              </button>
              <button onClick={() => setPage("mybids")}>
                My Bids
              </button>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")}>Login</button>
              <button onClick={() => setPage("signup")}>Sign Up</button>
            </>
          )}

          <button onClick={() => setPage("admin")}>Admin</button>
        </div>
      </nav>

      {message && (
        <div className="message">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {page === "home" && (
        <>
          <section className="hero">
            <div className="hero-content">
              <span className="tagline">WELCOME TO AUCTIONHUB</span>
              <h1>Bid Smart. Win Big.</h1>
              <p>
                Discover products, place your bids, and enjoy a simple
                online auction experience.
              </p>
              <button
                className="primary-btn"
                onClick={() =>
                  loggedInUser
                    ? setPage("dashboard")
                    : setPage("signup")
                }
              >
                Explore Auctions
              </button>
            </div>

            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
                alt="Online shopping"
              />
            </div>
          </section>

          <section className="features">
            <h2>Why Choose AuctionHub?</h2>

            <div className="feature-cards">
              <div className="feature-card">
                <h3>Admin-Reviewed Listings</h3>
                <p>
                  Products are reviewed by the admin before appearing
                  in the buyer dashboard.
                </p>
              </div>

              <div className="feature-card">
                <h3>Easy Bidding</h3>
                <p>
                  Browse available products and place bids easily.
                </p>
              </div>

              <div className="feature-card">
                <h3>Buyer Complaints</h3>
                <p>
                  Customers can report suspicious listings or product
                  issues for admin review.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {page === "signup" && (
        <section className="auth-section">
          <form className="auth-card" onSubmit={handleSignup}>
            <h2>Create Account</h2>
            <p>Join AuctionHub today.</p>

            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <button className="primary-btn" type="submit">
              Sign Up
            </button>

            <p>
              Already registered?{" "}
              <span className="text-link" onClick={() => setPage("login")}>
                Login
              </span>
            </p>
          </form>
        </section>
      )}

      {page === "login" && (
        <section className="auth-section">
          <form className="auth-card" onSubmit={handleLogin}>
            <h2>User Login</h2>
            <p>Login to start bidding.</p>

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <button className="primary-btn" type="submit">
              Login
            </button>

            <p>
              New user?{" "}
              <span className="text-link" onClick={() => setPage("signup")}>
                Create Account
              </span>
            </p>
          </form>
        </section>
      )}

      {page === "admin" && (
        <section className="auth-section">
          <form className="auth-card" onSubmit={handleAdminLogin}>
            <h2>Admin Login</h2>
            <p>Login to manage AuctionHub.</p>

            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />

            <button className="primary-btn" type="submit">
              Admin Login
            </button>
          </form>
        </section>
      )}

      {page === "adminDashboard" && (
        <section className="dashboard">
          <div className="dashboard-header">
            <div>
              <span className="tagline">ADMIN PANEL</span>
              <h1>Admin Dashboard</h1>
              <p>Review products, manage users and handle complaints.</p>
            </div>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <h3>{users.length}</h3>
              <p>Registered Users</p>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <h3>{products.length}</h3>
              <p>Total Products</p>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🔨</span>
              <h3>{bids.length}</h3>
              <p>Total Bids</p>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🚩</span>
              <h3>{reports.filter((r) => r.status === "Pending Review").length}</h3>
              <p>Pending Reports</p>
            </div>
          </div>

          <div className="admin-section">
            <h2>Submit New Product for Verification</h2>

            <form className="add-product-form" onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Starting Price (₹)"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                min="1"
                required
              />

              <input
                type="text"
                placeholder="Seller Name"
                value={newSellerName}
                onChange={(e) => setNewSellerName(e.target.value)}
                required
              />

              <select
                value={newProductCondition}
                onChange={(e) => setNewProductCondition(e.target.value)}
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </select>

              <textarea
                placeholder="Product description and specifications"
                value={newProductDescription}
                onChange={(e) => setNewProductDescription(e.target.value)}
                required
              />

              <input
                type="url"
                placeholder="Product Image URL"
                value={newProductImage}
                onChange={(e) => setNewProductImage(e.target.value)}
                required
              />

              <input
                type="url"
                placeholder="Purchase Bill / Ownership Proof URL"
                value={newProductProof}
                onChange={(e) => setNewProductProof(e.target.value)}
                required
              />

              <button className="primary-btn" type="submit">
                Submit for Verification
              </button>
            </form>

            <p className="small-note">
              New products remain hidden from customers until the admin
              reviews the details and proof and approves the listing.
              Use a shareable link for the demo proof document.
            </p>
          </div>

          <div className="admin-section">
            <h2>Review and Manage Products</h2>

            {products.length === 0 ? (
              <p>No products available.</p>
            ) : (
              <div className="admin-product-list">
                {products.map((product) => (
                  <div className="admin-product" key={product.id}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="admin-product-image"
                    />

                    <div className="admin-product-details">
                      <h3>{product.name}</h3>
                      <p>Seller: {product.seller}</p>
                      <p>Condition: {product.condition}</p>
                      <p>
                        Price: ₹
                        {Number(product.price).toLocaleString("en-IN")}
                      </p>
                      <p>Description: {product.description}</p>

                      {product.proofUrl ? (
                        <p>
                          <a
                            href={product.proofUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Purchase / Ownership Proof
                          </a>
                        </p>
                      ) : (
                        <p className="small-note">
                          No proof link submitted.
                        </p>
                      )}

                      <span
                        className={`status ${product.verificationStatus}`}
                      >
                        {product.verificationStatus}
                      </span>
                    </div>

                    <div className="admin-actions">
                      {product.verificationStatus !== "approved" && (
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleVerifyProduct(product.id, "approved")
                          }
                        >
                          Approve
                        </button>
                      )}

                      {product.verificationStatus !== "rejected" && (
                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleVerifyProduct(product.id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      )}

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-section">
            <h2>Customer Complaints</h2>

            {reports.length === 0 ? (
              <p>No customer complaints submitted yet.</p>
            ) : (
              <div className="report-list">
                {reports.map((report) => (
                  <div className="report-card" key={report.id}>
                    <h3>{report.productName}</h3>
                    <p>Reported by: {report.reportedBy}</p>
                    <p>Reason: {report.reason}</p>
                    <p>Details: {report.details}</p>
                    <p>Date: {report.date}</p>

                    <span
                      className={`status ${
                        report.status === "Reviewed" ? "approved" : "pending"
                      }`}
                    >
                      {report.status}
                    </span>

                    {report.status === "Pending Review" && (
                      <button
                        className="approve-btn"
                        onClick={() => handleResolveReport(report.id)}
                      >
                        Mark as Reviewed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-section">
            <h2>Registered Users</h2>

            {users.length === 0 ? (
              <p>No registered users yet.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {page === "dashboard" && (
        <section className="dashboard">
          <div className="dashboard-header">
            <div>
              <span className="tagline">USER DASHBOARD</span>
              <h1>Welcome, {loggedInUser}!</h1>
              <p>Explore admin-approved products and place your bids.</p>
            </div>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <h3>{approvedProducts.length}</h3>
              <p>Available Products</p>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🔨</span>
              <h3>{userBids.length}</h3>
              <p>My Bids</p>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="notification-section">
              <h2>Notifications</h2>
              {notifications.slice(-3).reverse().map((notification) => (
                <p className="notification" key={notification.id}>
                  {notification.text}
                </p>
              ))}
            </div>
          )}

          <div className="auction-heading">
            <h2>Available Auctions</h2>
            <p>Only products approved by the admin are displayed here.</p>
          </div>

          {approvedProducts.length === 0 ? (
            <p className="empty-message">
              No admin-verified products are available yet. Please check
              again later.
            </p>
          ) : (
            <div className="product-grid">
              {approvedProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="seller-name">
                      Seller: {product.seller}
                    </p>

                    <p>Condition: {product.condition}</p>
                    <p>{product.description}</p>

                    <span className="verified-badge">
                      ✓ Admin Verified
                    </span>

                   <p className="small-note">
  Admin verified based on submitted product details and proof.
  Buyers are advised to check product details before bidding.
</p>

                    <h3 className="product-price">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </h3>

                    <div className="bid-section">
                      <button
                        className="primary-btn"
                        onClick={() => openBidForm(product)}
                      >
                        Place Bid
                      </button>

                      <button
                        className="report-btn"
                        onClick={() => openReportForm(product)}
                      >
                        Report an Issue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedProduct && (
            <div className="modal-overlay">
              <form className="bid-modal" onSubmit={handleBid}>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setSelectedProduct(null)}
                >
                  ×
                </button>

                <h2>Place Your Bid</h2>
                <h3>{selectedProduct.name}</h3>

                <p>
                  Current Price: ₹
                  {Number(selectedProduct.price).toLocaleString("en-IN")}
                </p>

                <input
                  type="number"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={selectedProduct.price + 1}
                  required
                />

                <button className="primary-btn" type="submit">
                  Submit Bid
                </button>
              </form>
            </div>
          )}

          {reportProduct && (
            <div className="modal-overlay">
              <form className="bid-modal" onSubmit={handleReportProduct}>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setReportProduct(null)}
                >
                  ×
                </button>

                <h2>Report a Product Issue</h2>
                <p>Product: {reportProduct.name}</p>

                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                >
                  <option value="">Select complaint reason</option>
                  <option value="Product is different from its description">
                    Product is different from its description
                  </option>
                  <option value="Suspected counterfeit product">
                    Suspected counterfeit product
                  </option>
                  <option value="Damaged product received">
                    Damaged product received
                  </option>
                  <option value="Wrong product received">
                    Wrong product received
                  </option>
                  <option value="Suspicious seller or listing">
                    Suspicious seller or listing
                  </option>
                  <option value="Other issue">Other issue</option>
                </select>

                <textarea
                  placeholder="Explain the issue..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  required
                />

                <button className="primary-btn" type="submit">
                  Submit Complaint
                </button>
              </form>
            </div>
          )}
        </section>
      )}

      {page === "mybids" && (
        <section className="dashboard">
          <div className="dashboard-header">
            <div>
              <span className="tagline">BIDDING HISTORY</span>
              <h1>My Bids</h1>
              <p>View the bids you have placed.</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setPage("dashboard")}
            >
              Back to Auctions
            </button>
          </div>

          {userBids.length === 0 ? (
            <p className="empty-message">
              You have not placed any bids yet.
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Bid Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {userBids.map((bid) => (
                    <tr key={bid.id}>
                      <td>{bid.productName}</td>
                      <td>
                        ₹{Number(bid.amount).toLocaleString("en-IN")}
                      </td>
                      <td>{bid.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <footer className="footer">
        <h2>AuctionHub</h2>
        <p>Online Auction System - College Project</p>
        <p>© 2026 AuctionHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
