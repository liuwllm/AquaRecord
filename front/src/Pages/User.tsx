import { useLocation } from "react-router-dom";

const UserPage: React.FC = () => {
    const location = useLocation();
    console.log(location.state);
    const user = location.state;
    return (
        <div>
            <h1>Welcome, {user.firstname} {user.lastname}</h1>
            <h3>User Info</h3>
            <p>Username: {user.username}</p>
            <p>Weight: {user.weight}</p>
            <p>UserID: {user.id}</p>
        </div>
    )
}

export default UserPage;