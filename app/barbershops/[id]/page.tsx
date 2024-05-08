import { Button } from "@/app/_components/ui/button";
import { db } from "@/app/_lib/prisma";
import {
  ArrowBigLeft,
  ArrowLeft,
  ChevronLeft,
  MapPinIcon,
  MenuIcon,
  StarIcon,
  icons,
} from "lucide-react";
import Image from "next/image";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

interface BarbershopDetailPageProps {
  params: {
    id?: string;
  };
}

const BarbershopDetailPage = async ({ params }: BarbershopDetailPageProps) => {
  const session = await getServerSession(authOptions);
  if (!params.id) {
    // TO DO redirecionar para a home
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    // TO DO redirecionar para a home

    return null;
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />
      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service) => (
          <ServiceItem
            key={service.id}
            barbershop={barbershop}
            service={service}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>
    </div>
  );
};

export default BarbershopDetailPage;
