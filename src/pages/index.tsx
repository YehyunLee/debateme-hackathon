import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import { Microphone } from "./microphone";

export default function Home() {


  return (
    <Microphone />


  );
 }


    
