"use client"
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop, Service } from "@prisma/client";
import { signIn } from "next-auth/react";
import Image from "next/image"
import { useMemo, useState } from "react";
import  { ptBR } from "date-fns/locale";
import { generateDayTimeList } from "../_helpers/hours";
import { format } from "date-fns";


interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated?: boolean;
}

const ServiceItem = ({service, barbershop, isAuthenticated} : ServiceItemProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>()

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined)
  }

  const handleHourClick = (time: string) => {
    setHour(time)
  }

  const handleScheduleClick = () => {
    if (!isAuthenticated) {
      console.log(isAuthenticated, "Você precisa estar logado para agendar um serviço")
      signIn("google")
    }

  }

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : []
  }, [date])

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
              <Sheet>
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
                      onClick={handleScheduleClick}
                      disabled={!date || !hour}
                    >
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