"use client";

import { Button } from "@/app/_components/ui/button";
import { Barbershop } from "@prisma/client";
import { ChevronLeft, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image"
import { useRouter } from "next/navigation";
import ServiceItem from "./service-item";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import SideMenu from "@/app/_components/side-menu";

interface BarbershopInfoProps {
  barbershop: Barbershop
}

const BarbershopInfo = ({barbershop} : BarbershopInfoProps) => {

  const router = useRouter()

 const handleBackClick = () => {
    router.back()
  }

  return ( 
    <div>
      <div className="h-[250px] w-full relative">
        <Button onClick={handleBackClick} className="absolute left-4 top-4 z-50" size="icon" variant="outline">
          <ChevronLeft></ChevronLeft>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="absolute right-4 top-4 z-50" size="icon" variant="outline">
              <MenuIcon></MenuIcon>
            </Button>
          </SheetTrigger>
        
          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>
       
        <Image 
          src={barbershop.imageUrl}        
          fill
          alt={'Imagem da barbearia ' + barbershop.name}
          className="opacity-75"
          style={{
            objectFit: "cover"
          }}
        />

      </div>
      <div className="px-5 py-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl font-bold">{barbershop?.name}</h1>
        <div className="flex items-center gap-1 mt-2">
          <MapPinIcon className="text-primary" size={18}></MapPinIcon>
          <p className="text-sm">{barbershop.address}</p>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <StarIcon className="text-primary fill-primary" size={18}></StarIcon>
          <p className="text-sm">5,0 (899 avaliações)</p>
        </div>
      </div>
    </div>
   );
}
 
export default BarbershopInfo;