import { useEffect, useState } from "react";
import { getAllUsersApi, deleteUserApi } from "../services/RoomService";
import { useNavigate } from "react-router";
import { User, Phone, Trash2 } from "lucide-react";
import CustomPopup from "../components/CustomPopup";
import ConfirmPopup from "./ConfirmPopup";

export default function AdminAllUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getAllUsersApi();
    setUsers(data);
  };

  const openUserPopup = (user) => {
    setPopupContent(user);
    setPopupOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await deleteUserApi(id);
    loadUsers();
  };
  const handleConfirmDelete = async () => {
    await deleteUserApi(deleteId);
    loadUsers();
    setConfirmOpen(false);
  };

  // 🔍 FILTERED LIST
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchDate = filterDate ? u.createdAt?.startsWith(filterDate) : true;

    return matchSearch && matchDate;
  });

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-blue-400">All Users</h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search username or email..."
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* User Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="relative bg-gray-800 p-6 rounded-xl border border-gray-700 
                       shadow-lg hover:shadow-blue-500/25 transition hover:scale-105"
          >
            {/* Delete Button */}
            {/* <button
              onClick={() => handleDeleteUser(u.id)}
              className="absolute top-3 right-3 p-2 rounded-full bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={18} color="white" />
            </button> */}
            <button
              onClick={() => {
                setDeleteId(u.id);
                setConfirmOpen(true);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={18} color="white" />
            </button>

            {/* CARD TOP / PHOTO */}
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => openUserPopup(u)}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-400">
                {u.photo ? (
                  <img
                    src={`data:image/jpeg;base64,${u.photo}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-blue-600 w-full h-full flex items-center justify-center">
                    <User size={28} />
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-blue-400">
                  {u.username}
                </h2>
                <p className="text-gray-400 text-sm">{u.email}</p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-4 text-gray-300">
              <p className="flex items-center gap-2">
                <Phone size={15} /> {u.phone}
              </p>

              <p className="text-gray-500 text-sm mt-3">
                <b>Joined:</b> {u.createdAt}
              </p>

              <p className="text-gray-400 text-sm mt-2">
                <b>Rooms:</b>{" "}
                {u.joinedRooms?.length > 0
                  ? u.joinedRooms.join(", ")
                  : "No rooms created"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* USER POPUP */}
      <CustomPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="User Details"
        content={
          popupContent && (
            <div>
              <p>
                <b>Username:</b> {popupContent.username}
              </p>
              <p>
                <b>Email:</b> {popupContent.email}
              </p>
              <p>
                <b>Phone:</b> {popupContent.phone}
              </p>
              <p>
                <b>Joined Date:</b> {popupContent.createdAt}
              </p>

              <p>
                <b>Rooms:</b>
                {popupContent.joinedRooms?.length > 0
                  ? popupContent.joinedRooms.join(", ")
                  : "No rooms created"}
              </p>

              {popupContent.photo && (
                <img
                  src={`data:image/jpeg;base64,${popupContent.photo}`}
                  className="w-32 h-32 rounded-lg mt-3"
                />
              )}
            </div>
          )
        }
      />
      <ConfirmPopup
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User?"
        content="Are you sure you want to delete this user permanently?"
      />
    </div>
  );
}
