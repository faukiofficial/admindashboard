import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"


const AdminDashboard = ({user}) => {
  return (
    <div className="flex">
        <Sidebar user={user}/>
        <Outlet/>
    </div>
  )
}

export default AdminDashboard