import dynamic from "next/dynamic";
import CircularProgress from "@mui/material/CircularProgress";

const LoginPage = dynamic(() => import("@/screenPages/AuthFlow/Login"), {
  loading: () => <CircularProgress />,
});

const LoginPageFlow = () => {
  return <LoginPage />;
};

export default LoginPageFlow;
