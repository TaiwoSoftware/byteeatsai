import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
const Users = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      console.log("All users:", data);

      setUsers(data ?? []);
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">User List</h2>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id} // ✅ correct key from your DB
            className="flex items-center justify-between border p-4 rounded-md hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium text-gray-800">
                  {user.name || "Unnamed User"} {/* ✅ bracket notation for spaces */}
                </p>

                <p className="text-sm text-gray-500">
                  {user.email || "No email"} {/* ✅ correct column */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;