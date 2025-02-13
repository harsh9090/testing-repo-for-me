import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import Navbar from "@/component/Navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
