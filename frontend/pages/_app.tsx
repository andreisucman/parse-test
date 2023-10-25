import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head></Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
