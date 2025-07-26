import dynamic from "next/dynamic";
import CircularProgress from "@mui/material/CircularProgress";

const ReceiptList = dynamic(() => import("@/screenPages/ReceiptListing"), {
  loading: () => <CircularProgress />,
});

export default function Home() {
    return <ReceiptList />
  
}
