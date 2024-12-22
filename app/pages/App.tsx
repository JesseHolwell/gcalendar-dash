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
    <div className="min-h-screen bg-[url('/images/forest-background.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-black/75 p-12 text-white">
        <div className="mx-auto space-y-8">
          <div className="flex md:flex-row flex-col justify-between items-center w-full gap-8 items-stretch">
            <Greeting />
            <Affirmation />
            <Clock />
            <Weather />
            <div className="flex w-full md:w-auto justify-end -order-1 md:order-1 items-center">
              <Refresh />
              <AppDrawer />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Tasks />
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
