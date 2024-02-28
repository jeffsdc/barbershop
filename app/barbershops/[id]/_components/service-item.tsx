"use client"
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image"
import { useEffect, useMemo, useState } from "react";
import  { ptBR } from "date-fns/locale";
import { generateDayTimeList } from "../_helpers/hours";
import { format, getDay, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../_actions/get-day-bookings";


interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated?: boolean;
}

const ServiceItem = ({service, barbershop, isAuthenticated} : ServiceItemProps) => {
  const router = useRouter()
  const { data } = useSession()
  const [submitIsLoading, setSubmitIsLoading] = useState(false)
  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>()
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  console.log({dayBookings});
  

  useEffect(() => {
    if(!date){
      return
    }

    const refreshAvailableHours = async () => {
      const _dayBookingsAvailable = await getDayBookings(barbershop.id, date);

      setDayBookings(_dayBookingsAvailable)
    }

    refreshAvailableHours();
  }, [date, barbershop.id])

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined)
  }

  const handleHourClick = (time: string) => {
    setHour(time)
  }

  const handleScheduleClick = () => {
    if (!isAuthenticated) {
      signIn("google")
    }
  }

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true)
    try{
      if(!date || !hour || !data?.user){
        return
      }

      const dateHour = Number(hour?.split(":")[0]);
      const dateMinute = Number(hour?.split(":")[1]);
      const newDate = setMinutes(setHours(date, dateHour), dateMinute)

      await saveBooking({
        barbershopId: barbershop.id,
        serviceId: service.id,
        date: newDate,
        userId: (data.user as any).id,
      })
      setSheetIsOpen(false);
      setDate(undefined)
      setHour(undefined)
      toast("Reserva realizada com Sucesso", {
        description: format(newDate, "dd 'de' MMMM 'às' HH:mm", {locale: ptBR}),
        action: {
          label: "Visualizar Reserva",
          onClick: () => router.push("/bookings"),
        },
      })
    }catch(error){
      console.log(error)
    }finally{
      setSubmitIsLoading(false)
    }
  }

  const timeList = useMemo(() => {
    if(!date){
      return [];
    }

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0])
      const timeMinute = Number(time.split(":")[1]) 

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours()
        const bookingMinute = booking.date.getMinutes()

        return bookingHour === timeHour && bookingMinute === timeMinute;
      })

      if (!booking) {
        return true
      }

      return false
    })
  }, [date, dayBookings])

  return ( 
    <Card className="mb-4">
      <CardContent className="p-3 w-full">
        <div className="flex gap-4 items-center w-full">
          <div className="min-w-[110px] min-h-[110px] max-w-[110px] max-h-[110px] relative">
            <Image 
              src={service.imageUrl} 
              alt={service.name} 
              fill 
              className="rounded-lg"
              style={{
                objectFit: "contain"  
              }}
            />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-primary font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(Number(service.price))}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleScheduleClick}>Agendar</Button>
                </SheetTrigger>
              
                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Agendamento</SheetTitle>
                  </SheetHeader>
                  <div className="">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      className="mt-6"
                      locale={ptBR}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_next: {
                          width: "32px",
                        },
                        nav_button_previous: {
                          width: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        }
                      }}
                    />
                  </div>
                  {date && (
                    <div className="py-6 px-5 border-t border-solid border-secondary ">
                      <h3 className="text-sm font-bold">Horários Disponíveis</h3>
                      <div className="py-6 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {timeList.map((time) => (
                          <Button 
                            key={time} 
                            variant={hour== time ? "default" : "outline"}
                            className="rounded-full"
                            onClick={() => handleHourClick(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 flex flex-col gap-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="text-sm font-bold">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL"
                            }).format(Number(service.price))}
                          </h3>
                        </div>
                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Data</h3>
                            <h4 className="text-sm">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR
                              })}
                            </h4>
                          </div>
                        )}
                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Horário</h3>
                            <h4 className="text-sm">
                              {hour}
                            </h4>
                          </div>
                        )}
                        <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Barbearia</h3>
                            <h4 className="text-sm">
                              {barbershop.name}
                            </h4>
                          </div>
                      </CardContent>
                    </Card>
                  </div>
                  <SheetFooter className="px-5">
                          
                    <Button 
                      className="w-full mt-6"
                      onClick={handleBookingSubmit}
                      disabled={!date || !hour || submitIsLoading}
                    >
                      {submitIsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                      Confirmar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              
            </div>
          </div>          
        </div>
      </CardContent>
    </Card>
   );
}
 
export default ServiceItem;