"use client"
import { CalendarIcon, CircleUserRound, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const SideMenu = () => {

  const {data} = useSession();

  const handleLogoutClick = () => signOut();
  const handleLoginClick = () =>  signIn("google");

  return ( 
    <>
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
    </>
   );
}
 
export default SideMenu;