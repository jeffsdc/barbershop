"use client"

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, CalendarIcon, CircleUserRound, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, icons } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import SideMenu from "./side-menu";

const Header = () => {
  const {data} = useSession();
  const handleLoginClick = async () => {
    await signIn("google")
  }
  const handleLogoutClick = async () => {
    await signOut()
  }
  return ( 
    <Card>
      <CardContent className="px-5 py-8 justify-between flex flex-row items-center">
        <Image 
          src="/Logo.png" 
          alt="FWS BarberShop Logo" 
          height={18}
          width={120}
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={16}></MenuIcon>
            </Button>
          </SheetTrigger>
        
          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
   );
}
 
export default Header;