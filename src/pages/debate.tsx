/* eslint-disable @typescript-eslint/no-unused-vars */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import Image from "next/image";
import VoiceToText from "~/components/VoiceToText";

import { api } from "~/utils/api";



export default function debate() {

  return (
    <>
      < div className="w-[100vw] flex-col ">
      <div className="bubble left">Bro ipsum dolor sit amet gaper backside single track, manny Bike epic clipless. Schraeder drop gondy, rail fatty slash gear jammer steeps</div>
        <div className="bubble right">Ok, Thank you</div>
        <div className="bubble left"> ut labore et dolore magna </div>
        <div className="bubble right">Ok, Thank you</div>
        <div className="bubble right">Ok, Thank you</div>
        <div className="bubble right">Ok, Thank you</div>

        <div className="bubble right">Ok, Thank you</div>

        <div className="bubble right">Ok, Thank you</div>


        <div className="bubble right">Ok, Thank you</div>

        <div className="bubble right">Ok, Thank you</div>

        <div className="bubble right">Ok, Thank you</div>
        <VoiceToText />
        </div>
    </>
  );
}
