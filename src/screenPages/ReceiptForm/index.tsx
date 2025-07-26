import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Delete, Add } from "@mui/icons-material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { validateReceipt } from "@/constant/Validation";

interface ReceiptItem {
  itemName: string;
  unit: string;
  rate: number;
  qty: number;
  gross: number;
  discountPercent: number;
  discountAmount: number;
  netAmount: number;
}

export default function ReceiptCreate() {
  const [receiptNo, setReceiptNo] = useState(uuidv4());
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [personName, setPersonName] = useState("");
  const [items, setItems] = useState([
    {
      itemName: "",
      unit: "",
      rate: 0,
      qty: 0,
      gross: 0,
      discountPercent: 0,
      discountAmount: 0,
      netAmount: 0,
    },
  ]);

  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState({
    personName: "",
    remarks: "",
    items: [],
  });

  const handleItemChange = (
    index: number,
    field: keyof ReceiptItem,
    value: any
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    const rate = Number(updatedItems[index].rate || 0);
    const qty = Number(updatedItems[index].qty || 0);
    const discountPercent = Number(updatedItems[index].discountPercent || 0);
    const gross = rate * qty;
    const discountAmount = (gross * discountPercent) / 100;
    const netAmount = gross - discountAmount;

    updatedItems[index].gross = gross;
    updatedItems[index].discountAmount = discountAmount;
    updatedItems[index].netAmount = netAmount;

    setItems(updatedItems);
  };

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const addRow = () => {
    setItems([
      ...items,
      {
        itemName: "",
        unit: "",
        rate: 0,
        qty: 0,
        gross: 0,
        discountPercent: 0,
        discountAmount: 0,
        netAmount: 0,
      },
    ]);
  };

  const deleteRow = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const getTotals = () => {
    const totalQty = items.reduce(
      (acc, item) => acc + Number(item.qty || 0),
      0
    );
    const totalAmt = items.reduce(
      (acc, item) => acc + Number(item.gross || 0),
      0
    );
    const totalDiscount = items.reduce(
      (acc, item) => acc + Number(item.discountAmount || 0),
      0
    );
    const netAmount = totalAmt - totalDiscount;
    return { totalQty, totalAmt, totalDiscount, netAmount };
  };

  const { totalQty, totalAmt, totalDiscount, netAmount } = getTotals();

  const handleSave = () => {
    if (items.length === 0) {
      toast.error("Please add at least one item row.");
      return;
    }

    const { isValid, errors: validationErrors } = validateReceipt(
      personName,
      remarks,
      items
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const newReceipt = {
      receiptNo: uuidv4(),
      date,
      personName,
      items,
      remarks,
      totals: getTotals(),
    };

    const receipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    const updatedReceipts = [newReceipt, ...receipts];
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    setReceiptNo(uuidv4());
    setPersonName("");
    setItems([
      {
        itemName: "",
        unit: "",
        rate: 0,
        qty: 0,
        gross: 0,
        discountPercent: 0,
        discountAmount: 0,
        netAmount: 0,
      },
    ]);
    setRemarks("");
    setErrors({ personName: "", remarks: "", items: [] });

    router.push("/");
  };

  const handleClose = () => {
    router.push("/");
  };

  const handleNew = () => {
    localStorage.removeItem("editingReceipt");
    setRemarks("");
    setPersonName("");
    setItems([
      {
        itemName: "",
        unit: "",
        rate: 0,
        qty: 0,
        gross: 0,
        discountPercent: 0,
        discountAmount: 0,
        netAmount: 0,
      },
    ]);

    setErrors({ personName: "", remarks: "", items: [] });
    localStorage.removeItem("editingReceipt");
    setIsEditing(false);
  };

  useEffect(() => {
    setReceiptNo(uuidv4());
  }, []);

  useEffect(() => {
    const editingData = JSON.parse(
      localStorage.getItem("editingReceipt") || "null"
    );

    if (editingData) {
      setReceiptNo(editingData.receiptNo);
      setDate(editingData.date);
      setPersonName(editingData.personName);
      setItems(editingData.items || []);
      setRemarks(editingData.remarks || "");
      setIsEditing(true);
    } else {
      setReceiptNo(uuidv4());
      setIsEditing(false);
    }
  }, []);

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          gap={3}
        >
          <Typography variant="h6" fontWeight="bold">
            Receipt
          </Typography>

          <Box display="flex" gap={1}>
            <Button variant="outlined" onClick={handleNew}>
              New
            </Button>
            <Button variant="contained" onClick={handleSave}>
              {isEditing ? "Update" : "Save"}
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Grid>
        <Divider />
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 3, sm: 10 },
            flexWrap: { xs: "wrap", sm: "nowrap" },
            mt: 4,
          }}
        >
          <TextField
            size="small"
            label="Receipt No"
            value={receiptNo}
            disabled
            sx={{
              width: { xs: "100%", sm: "300px" },
            }}
          />

          <TextField
            size="small"
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: { xs: "100%", sm: "235px" },
            }}
          />
        </Grid>

        <TextField
          label="Person Name"
          size="small"
          fullWidth
          sx={{ mt: 4 }}
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          error={!!errors.personName}
          helperText={errors.personName}
        />

        <Box sx={{ overflowX: "auto", mt: 3 }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                {[
                  "Sr.",
                  "Item Name",
                  "Unit",
                  "Rate",
                  "Qty",
                  "Gross Amt",
                  "Discount %",
                  "Discount Amt",
                  "Net Amt",
                  "Actions",
                ].map((head, i) => (
                  <TableCell key={i}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemChange(index, "itemName", e.target.value)
                      }
                      error={!!errors.items?.[index]?.itemName}
                      helperText={errors.items?.[index]?.itemName}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(index, "unit", e.target.value)
                      }
                      error={!!errors.items?.[index]?.unit}
                      helperText={errors.items?.[index]?.unit}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      variant="standard"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", Number(e.target.value))
                      }
                      error={!!errors.items?.[index]?.rate}
                      helperText={errors.items?.[index]?.rate}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      variant="standard"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", Number(e.target.value))
                      }
                      error={!!errors.items?.[index]?.qty}
                      helperText={errors.items?.[index]?.qty}
                    />
                  </TableCell>
                  <TableCell>{item.gross.toFixed(2)}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      variant="standard"
                      value={item.discountPercent}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "discountPercent",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{item.discountAmount.toFixed(2)}</TableCell>
                  <TableCell>{item.netAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => deleteRow(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={10}>
                  <Button startIcon={<Add />} onClick={addRow}>
                    Add Row
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        <Grid
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 6,
            mt: 5,
          }}
        >
          <TextField
            label="Remarks"
            multiline
            rows={4}
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            error={!!errors.remarks}
            helperText={errors.remarks}
          />
          <TextField
            size="small"
            label="Total Qty"
            value={totalQty}
            InputProps={{ readOnly: true }}
            sx={{
              width: { xs: "100%", sm: "235px", md: "450px" },
            }}
          />

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              size="small"
              label="Total Amt"
              value={totalAmt.toFixed(2)}
              InputProps={{ readOnly: true }}
              sx={{
                width: { xs: "100%", sm: "235px" },
              }}
            />
            <TextField
              size="small"
              label="Discount"
              value={totalDiscount.toFixed(2)}
              InputProps={{ readOnly: true }}
              sx={{
                width: { xs: "100%", sm: "235px" },
              }}
            />
            <TextField
              size="small"
              label="Net Amount"
              value={netAmount.toFixed(2)}
              InputProps={{ readOnly: true }}
              sx={{
                width: { xs: "100%", sm: "235px" },
              }}
            />
          </Box>
        </Grid>
      </Paper>
    </Box>
  );
}
