"use client"

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, CalendarIcon, CircleUserRound, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, icons } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";

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
            <SheetHeader className="">
              <SheetTitle className="text-left border-b border-solid border-secondary p-5">
                Menu
              </SheetTitle>
              {data?.user ? (
                <div className="flex items-center px-5 py-6 justify-between">
                  <div className="flex items-center gap-3 m-0">
                    <Avatar>
                      <AvatarImage
                        src={data.user?.image ?? ""}
                      />
                    </Avatar>
                    <h2>{data.user.name}</h2>
                  </div>

                  <Button variant="secondary" size="icon" onClick={handleLogoutClick}>
                    <LogOutIcon />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-5 py-6">
                  <div className="flex items-center gap-2">
                    <CircleUserRound className="text-secondary font-normal" size={32}></CircleUserRound>
                    <h2 className="font-bold">Olá. Faça seu login!</h2>
                  </div>
                  <Button variant="secondary" className="gap-2 w-full justify-start" onClick={handleLoginClick}>
                    <LogInIcon />
                    Fazer Login
                  </Button>
                </div>
              )}
              {data?.user && (
                <div className="flex flex-col gap-3">
                <Button variant="outline" className="gap-2 w-full justify-start" asChild>
                  <Link href="/">
                    <HomeIcon size={18} />
                    Inicio
                  
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2 w-full justify-start" asChild>
                  <Link href="/bookings">
                    <CalendarIcon size={18} />
                    Agendamentos
                  </Link>
                </Button>
              </div>
              )}
              
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
   );
}
 
export default Header;