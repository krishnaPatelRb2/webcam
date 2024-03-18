import Image from "next/image";
import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';


export default function route() {
  
  return (
   <>
    <div>This is main UI</div>
    <Link href="/Dashboard">Child</Link>
    </>
  );
}
