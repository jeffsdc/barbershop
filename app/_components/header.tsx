import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon, icons } from "lucide-react";

const Header = () => {
  return ( 
    <Card>
      <CardContent className="px-5 py-8 justify-between flex flex-row items-center">
        <Image 
          src="/Logo.png" 
          alt="FWS BarberShop Logo" 
          height={18}
          width={120}
        />
        <Button variant="outline" size="icon" className="h-6 w-6">
          <MenuIcon></MenuIcon>
        </Button>
      </CardContent>
    </Card>
   );
}
 
export default Header;