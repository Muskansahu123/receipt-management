import dynamic from "next/dynamic";
import CircularProgress from "@mui/material/CircularProgress";

const ReceiptForm = dynamic(() => import("@/screenPages/ReceiptForm"), {
  loading: () => <CircularProgress />,
});

const ReceiptCrud = () => {
  return <ReceiptForm />;
};

export default ReceiptCrud;
