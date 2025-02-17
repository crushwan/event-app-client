import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async () => {
  const { data } = await axios.get("http://localhost:4000/");
  return data;
};

function UsersList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <ul>
      {/* {data.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))} */}
      <p>{data}</p>
    </ul>
  );
}

export default UsersList;
