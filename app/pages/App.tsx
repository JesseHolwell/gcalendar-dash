import Calendar from "@/components/Calendar";
import Greeting from "@/components/Greeting";
import Refresh from "@/components/Refresh";
import Affirmation from "../../components/Affirmation";
import AppDrawer from "../../components/AppDrawer";
import Clock from "../../components/Clock";
import Tasks from "../../components/Tasks";
import Weather from "../../components/Weather";

export default function App() {
  return (
    <div className="min-h-screen bg-[url('/images/forest-background.jpg')] bg-cover bg-center bg-fixed h-screen">
      <div className="min-h-screen bg-black/75 p-4 text-white h-screen flex flex-col mx-auto space-y-8 justify-between">
        <div className="flex md:flex-row flex-col justify-between items-center w-full gap-8 items-stretch">
          <Clock />
          <Greeting />
          <div className="flex w-full md:w-auto justify-end -order-1 md:order-1 items-center">
            <Refresh />
            <AppDrawer />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-64">
          <Tasks />
          <Calendar />
        </div>
        <div className="flex md:flex-row flex-col justify-between items-center w-full gap-8 items-stretch">
          <Weather />
          <Affirmation />
        </div>
      </div>
    </div>
  );
}
