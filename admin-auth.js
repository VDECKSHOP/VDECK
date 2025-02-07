document.addEventListener("DOMContentLoaded", () => {


    // Admin Credentials
    const storedUserId = "admin"; // Set your admin username
    const storedPassword = "12345"; // Set your admin password

    // Handle Login Form Submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const enteredUserId = document.getElementById("userid").value.trim();
            const enteredPassword = document.getElementById("password").value.trim();

            if (enteredUserId === storedUserId && enteredPassword === storedPassword) {
                localStorage.setItem("admin-logged-in", "true"); // Store login session
                window.location.href = "admin.html"; // ✅ Redirect to admin panel
            } else {
                document.getElementById("error-message").style.display = "block"; // Show error message
            }
        });
    }

    // Protect Admin Page: Redirect to login if not logged in
    if (window.location.pathname.endsWith("admin.html")) {
        if (localStorage.getItem("admin-logged-in") !== "true") {
            alert("Unauthorized access! Redirecting to login...");
            window.location.href = "admin-login.html"; // ✅ Redirect to login page
        }
    }

    // Handle Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("admin-logged-in"); // Clear session
            alert("Logged out successfully!");
            window.location.href = "admin-login.html"; // ✅ Redirect to login page
        });
    }
});