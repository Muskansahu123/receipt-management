import { useEffect,  } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const theme = createTheme();

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const isLoginPage = router.pathname === "/login";

    if (!user && !isLoginPage) {
      router.replace("/login");
    }

    if (user && isLoginPage) {
      router.replace("/"); 
    }
  }, [router.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Receipt Management App</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
      <ToastContainer />
    </ThemeProvider>
  );
}
