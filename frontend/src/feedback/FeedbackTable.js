import React, { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { CSVLink } from "react-csv";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import
import StarRating from "./StarRating"; // Make sure this component exists
import Swal from "sweetalert2";

const FeedbackTable = ({ rows, deleteFeedback }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    (row.employeeName && row.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (row.department && row.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const csvHeaders = [
    { label: "Customer Name", key: "employeeName" },
    { label: "Customer Email", key: "employeeEmail" },
    { label: "Select", key: "department" },
    { label: "Rating", key: "rating" },
    { label: "Feedback", key: "feedback" },
  ];

  const csvData = filteredRows.map((row) => ({
    employeeName: row.employeeName,
    employeeEmail: row.employeeEmail,
    department: row.department,
    rating: row.rating,
    feedback: row.feedback,
  }));

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const logoUrl = "https://res.cloudinary.com/dwcsi1wfq/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742364968/greenscape_ykjyib.jpg";

    const img = new Image();
    img.crossOrigin = "anonymous"; // To fix CORS issues
    img.src = logoUrl;
    img.onload = function () {
      const logoWidth = 35;
      const logoHeight = 35;
      const logoX = (pageWidth - logoWidth) / 2;

      doc.addImage(img, "PNG", logoX, 10, logoWidth, logoHeight);

      doc.setFontSize(16);
      doc.text("Feedback Report", pageWidth / 2, 65, { align: "center" });

      const generatedDate = new Date().toLocaleDateString();
      doc.setFontSize(12);
      doc.text(`Generated on: ${generatedDate}`, pageWidth / 2, 75, { align: "center" });

      autoTable(doc, {
        head: [["Customer Name", "Customer Email", "Select", "Rating", "Feedback"]],
        body: csvData.map((row) => [row.employeeName, row.employeeEmail, row.department, row.rating, row.feedback]),
        startY: 85,
        headStyles: {
          fillColor: [16, 196, 43],
          textColor: [255, 255, 255],
          halign: "center",
        },
        styles: {
          halign: "center",
          fontSize: 10,
        },
        bodyStyles: {
          textColor: [0, 0, 0],
        },
        margin: { top: 10 },
      });

      const finalY = doc.lastAutoTable.finalY + 20;
      doc.text(`Date: ${generatedDate}`, 14, finalY);
      doc.text("Signature: __________________", 120, finalY);

      doc.save("Feedback_Report.pdf");
    };
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteFeedback = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFeedback(id);
        Swal.fire("Deleted!", "Your feedback has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      <Typography
        variant="h4"
        sx={{
          flex: 1,
          color: "#000000",
          textAlign: "center",
          fontWeight: "bold",
          mt: 4,
          mb: 2,
        }}
      >
        Admin View Feedback
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          mx: 5,
        }}
      >
        <TextField
          label="Search by Name or Department"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 350 }}
        />

        <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", borderRadius: 2 }}>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#6EA95F",
              "&:hover": { backgroundColor: "#0d47a1" },
              textTransform: "none",
            }}
          >
            Download Report
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleClose}>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="feedback_data.csv"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Export as CSV
              </CSVLink>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleGeneratePDF();
              }}
            >
              Export as PDF
            </MenuItem>
          </Menu>
        </Paper>
      </Box>

      <TableContainer component={Paper} sx={{ mx: 5 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#6EA95F" }}>
            <TableRow>
              {["Employee Name", "Employee Email", "Select", "Rating", "Feedback", "Actions"].map((header) => (
                <TableCell key={header} sx={{ color: "#fff", fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.employeeName}</TableCell>
                  <TableCell>{row.employeeEmail}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>
                    <StarRating rating={row.rating} />
                  </TableCell>
                  <TableCell>{row.feedback}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteFeedback(row._id)}
                      sx={{ borderRadius: 2 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No feedback found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FeedbackTable;
