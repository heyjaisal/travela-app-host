import { Outlet } from "react-router-dom";
import AdminNavbar from "./Admin-navbar";

const AdminDashboardLayout = () => {
  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-auto bg-lightBg" >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
