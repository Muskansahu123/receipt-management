import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tableHeaders } from "@/constant/Arrays/TableHeadArray";
import { useRouter } from "next/router";

const ReceiptList = () => {
  const router = useRouter();

  const [receiptList, setReceiptList] = useState([]);

  useEffect(() => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    setReceiptList(savedReceipts);
  }, []);

  const handleAdd = () => {
    localStorage.removeItem("editingReceipt");
    router.push("/receipt");
  };

  const handleEdit = (receipt: any) => {
    localStorage.setItem("editingReceipt", JSON.stringify(receipt));
    router.push("/receipt");
  };

  const handleDelete = (receiptNo: string) => {
    const updatedReceipts = receiptList.filter(
      (receipt) => receipt.receiptNo !== receiptNo
    );
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    setReceiptList(updatedReceipts);
  };

  const handleLogout=()=>{
 const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.removeItem("user");
    localStorage.removeItem("receipts");
    router.push('/login')
  }
  }

  const formatCustomDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  console.log({ receiptList });

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          gap={3}
        >
          <Typography variant="h6" fontWeight="bold">
            Receipt List
          </Typography>

          <Box>
            <Button
              variant="contained"
              sx={{ mr: 1 }}
              onClick={handleAdd}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() => window.print()}
            >
              Print
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              LogOut
            </Button>
          </Box>
        </Grid>
        <Box sx={{ overflowX: "auto", mt: 3 }}>
          <TableContainer component={Paper} sx={{ minWidth: 1016 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header, idx) => (
                    <TableCell
                      align={header.align}
                      key={idx}
                      sx={{
                        // width: header.width || "auto",
                        fontWeight: "bold",
                      }}
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {receiptList.length > 0 ? (
                  receiptList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row?.receiptNo}</TableCell>
                      <TableCell>{formatCustomDate(row.date)}</TableCell>
                      <TableCell>{row.personName}</TableCell>
                      <TableCell>{row.totalQty}</TableCell>
                      <TableCell>{row.netAmount}</TableCell>
                      <TableCell>{row.remarks}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(row)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(row.receiptNo)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No Record Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={2} textAlign="left">
          <Typography variant="body2">
            Record Count: {receiptList.length}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReceiptList;
