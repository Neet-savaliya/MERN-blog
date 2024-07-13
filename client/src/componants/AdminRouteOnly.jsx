import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminRouteOnly() {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser.payload.admin ? <Outlet/> : <Navigate to="/profile?tab=profile"/>
}
