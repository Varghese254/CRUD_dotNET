function AdminFooter() {
  return (
    <footer style={styles.footer}>
      <p>© 2026 Admin Dashboard</p>
      <p>Contact: admin@company.com</p>
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "15px",
    backgroundColor: "#1e293b",
    color: "white",
    marginTop: "auto",
  },
};

export default AdminFooter;
