import { useSelector } from "react-redux";
import ChatLayout from "../chat";

export default function ChatPage() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  if (!userInfo) return <div>Loading user info...</div>;

  const currentUser = {
    _id: userInfo.id || userInfo._id,
    role: userInfo.role || "Host",
    name: userInfo.name || "Unnamed",
  };

  
  return <ChatLayout currentUser={currentUser} />;
}
