import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { TextField, Button, Box, Modal, MenuItem} from "@mui/material";

const API_URL = "https://gorest.co.in/public/v2/users";
const TOKEN = "1e161f6ba57799fd438e15a84227407a0f61cc6d4d7a465e308492831822cf90";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
    </GridToolbarContainer>
  );
}

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", gender: "", status: "" });
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (nameFilter = "") => {
    try {
      const url = nameFilter
        ? `${API_URL}?name=${encodeURIComponent(nameFilter)}&per_page=100`
        : `${API_URL}?per_page=100`;
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Błąd pobierania użytkowników:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchUsers(value);
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, gender: user.gender, status: user.status });
    setEmailError(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "email") setEmailError(false);
  };

  const handleSave = async () => {
    if (!validateEmail(formData.email)) {
      setEmailError(true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Błąd aktualizacji użytkownika");

      const updatedUser = await res.json();
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      setEditingUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100, disableColumnMenu: true, sortable: false },
    { field: "name", headerName: "Imię", width: 200, disableColumnMenu: true, sortable: false },
    { field: "email", headerName: "Email", width: 350, disableColumnMenu: true, sortable: false },
    { field: "gender", headerName: "Płeć", width: 120, disableColumnMenu: true, sortable: false },
    { field: "status", headerName: "Status", width: 120, disableColumnMenu: true, sortable: false },
    {
      field: "edit",
      headerName: "Akcje",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Button variant="contained" color="primary" size="small" onClick={() => startEditing(params.row)}>
          Edytuj
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <h1>Lista użytkowników</h1>
      <TextField
        label="Szukaj użytkownika (tylko po imieniu)"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={handleSearch}
      />
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{ Toolbar: CustomToolbar }}
        />
      </div>

      <Modal open={!!editingUser} onClose={() => setEditingUser(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Edytuj użytkownika</h2>
          <TextField
            label="Imię"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            error={emailError}
            helperText={emailError ? "Nieprawidłowy format emaila" : ""}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Płeć"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="male">male</MenuItem>
            <MenuItem value="female">female</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 3 }}
          >
            <MenuItem value="active">active</MenuItem>
            <MenuItem value="inactive">inactive</MenuItem>
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setEditingUser(null)}>Anuluj</Button>
            <Button variant="contained" color="success" onClick={handleSave}>
              Zapisz
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default App;
