import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function UserHome() {
  return (
    <div style={styles.container}>
      <UserHeader />

      <main style={styles.main}>
        <h1>Welcome User</h1>
      </main>

      <UserFooter />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
};

export default UserHome;
