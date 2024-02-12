import {format} from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";

export default function Home() {
  return (
    <div>
      <Header/>
      <h2 className="text-lg font-bold">Olá, Miguel!</h2>
      <p className="capitalize text-sm">{format(new Date(), "EEEE', 'dd 'de 'MMMM' de 'yyyy", {
        locale: ptBR
      })}</p>
    </div>
  );
}
