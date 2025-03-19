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
import { CSVLink } from 'react-csv';
import Search from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import StarRating from './StarRating'; // Ensure you have a StarRating component
import Swal from 'sweetalert2';

const FeedbackTable = ({ rows, deleteFeedback }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRows = rows.filter(row =>
        (row.employeeName && row.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (row.department && row.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const csvHeaders = [
        { label: 'Customer Name', key: 'employeeName' },
        { label: 'Customer Email', key: 'employeeEmail' },
        { label: 'Select', key: 'department' },
        { label: 'Rating', key: 'rating' },
        { label: 'Feedback', key: 'feedback' },
    ];

    const csvData = filteredRows.map(row => ({
        employeeName: row.employeeName,
        employeeEmail: row.employeeEmail,
        department: row.department,
        rating: row.rating,
        feedback: row.feedback,
    }));

    const handleGeneratePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const logoWidth = 35;
        const logoHeight = 35;
        const logoX = (pageWidth - logoWidth) / 2; // Center logo horizontally

        const logoUrl = 'https://res.cloudinary.com/dwcsi1wfq/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742364968/greenscape_ykjyib.jpg'; // Update to a valid image path

        const img = new Image();
        img.src = logoUrl;
        img.onload = function () {
            doc.addImage(img, 'PNG', logoX, 10, logoWidth, logoHeight); // Adjust Y position as needed

          

            doc.setFontSize(16);
            doc.text("Feedback Report", pageWidth / 2, 65, { align: 'center' });

            // Add generated date
            const generatedDate = new Date().toLocaleDateString();
            doc.setFontSize(12);
            doc.text(`Generated on: ${generatedDate}`, pageWidth / 2, 75, { align: 'center' });

            // Add the feedback report table
            doc.autoTable({
                head: [['Customer Name', 'Customer Email', 'Select', 'Rating', 'Feedback']],
                body: csvData.map(row => [row.employeeName, row.employeeEmail, row.department, row.rating, row.feedback]),
                startY: 85, // Adjust starting position for the table
                headStyles: {
                    fillColor: [16, 196, 43],  // Green header
                    textColor: [255, 255, 255], // White text
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                },
                styles: {
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                    halign: 'center' // Center align text in cells
                },
                bodyStyles: {
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                },
                margin: { top: 10 }
            });

            // Footer with date and signature
            const finalY = doc.lastAutoTable.finalY + 20; // Get the Y position after the table
            doc.text(`Date: ${generatedDate}`, 14, finalY);
            doc.text("Signature: ________", 120, finalY);

            // Save the PDF
            doc.save("FeedBack_report.pdf");
        };
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const handleDeleteFeedback = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFeedback(id);
                Swal.fire(
                    'Deleted!',
                    'Your feedback has been deleted.',
                    'success'
                );
            }
        });
    };

    return (
        <div>
            <Typography variant="h4" sx={{ flex: 1, color: '#000000', marginLeft: 5, textAlign: 'center', fontWeight: 'bold', marginTop: '20px' }}>
                Admin View Feedback
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', marginTop: '20px' }}>
                <TextField
                    sx={{
                        borderRadius: '20px',
                        marginLeft: 12,
                        width: 350,
                        textAlign: 'center'
                    }}
                    label="Search by Employee Name or Department"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ fontSize: '2rem', borderRadius: '50%' }} />
                            </InputAdornment>
                        )
                    }}
                />
                <Paper elevation={3} sx={{
                    boxShadow: 5,
                    borderRadius: '20px',
                    width: 250,
                    height: 80,
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                    marginRight: '20px'
                }}>
                    <Button
                        onClick={handleClick}
                        sx={{
                            color: "white",
                            fontWeight: 'bold',
                            fontSize: 14,
                            borderRadius: '40px',
                            backgroundColor: '#6EA95F',
                            '&:hover': {
                                backgroundColor: '#0d47a1',
                            },
                            textTransform: 'none',
                        }}
                    >
                        Download Report
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        sx={{ marginTop: '10px' }}
                    >
                        <MenuItem onClick={() => {
                            handleClose();
                        }}>
                            <CSVLink
                                data={csvData}
                                headers={csvHeaders}
                                filename={"feedback_data.csv"}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                CSV
                            </CSVLink>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleClose();
                            handleGeneratePDF();
                        }}>
                            PDF
                        </MenuItem>
                    </Menu>
                </Paper>
            </Box>

            <TableContainer component={Paper} sx={{ margin: '20px auto', maxWidth: '90vw' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#6EA95F' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Employee Name</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Employee Email</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Select</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Rating</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Feedback</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredRows.length > 0 ? filteredRows.map(row => (
                                <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{row.employeeName}</TableCell>
                                    <TableCell>{row.employeeEmail}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>
                                        <StarRating rating={row.rating} />
                                    </TableCell>
                                    <TableCell>{row.feedback}</TableCell>
                                    <TableCell>
                                        <Button
                                            sx={{
                                                borderRadius: '20px',
                                                backgroundColor: '#ff1744',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#d50000',
                                                },
                                            }}
                                            onClick={() => handleDeleteFeedback(row._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No feedback found</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FeedbackTable;
