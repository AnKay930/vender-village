import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

const AssignUserRole = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user && !user.privateMetadata?.role) {
      user
        .update({
          privateMetadata: { role: "customer" },
        })
        .then(() => console.log("Role assigned in privateMetadata"));
    }
  }, [user]);

  return null;
};

export default AssignUserRole;
