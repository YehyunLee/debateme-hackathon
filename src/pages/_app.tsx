import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Nav from '../components/nav';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "../output.css";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    AOS.init({
         duration: 800,
         once: false,
       })
 }, [])

  return (
    <SessionProvider session={session}>
      <div className=" font-mono">
      <Nav />
      <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
