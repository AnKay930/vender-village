import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const useUserRole = () => {
  const { user } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/users/get-user-role?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Role:", data.role);
          setRole(data.role);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching role:", err);
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  return { role, loading, error };
};

export default useUserRole;
