import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

function AdminHome() {
  return (
    <div style={styles.container}>
      <AdminHeader />

      <main style={styles.main}>
        <h1>Welcome Admin</h1>
      </main>

      <AdminFooter />
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

export default AdminHome;
