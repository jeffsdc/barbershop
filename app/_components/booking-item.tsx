import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { isFuture } from "date-fns/isFuture";

interface BookingListProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingListProps) => {
  const isBookingConfirmed = isFuture(booking.date);

  return (
    <div>
      <Card>
        <CardContent className="px-0 flex py-0">
          <div className="flex flex-col gap-2 py-5 flex-[3] pl-5">
            <Badge
              variant={!isBookingConfirmed ? "secondary" : "default"}
              className="w-fit"
            >
              {!isBookingConfirmed ? "Finalizado" : "Confirmado"}
            </Badge>
            <h2 className="font-bold">{booking.service.name}</h2>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={booking.barbershop.imageUrl}
                  alt="Imagem do Corte de Cabelo"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <h3 className="text-sm">{booking.barbershop.name}</h3>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center border-l border-secondary border-solid flex-1">
            <p className="text-sm capitalize">
              {format(booking.date, "MMMM", {
                locale: ptBR,
              })}
            </p>
            <p className="text-2xl">{format(booking.date, "dd")}</p>
            <p className="text-sm">{format(booking.date, "HH:mm")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingItem;
