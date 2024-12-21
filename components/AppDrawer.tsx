import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { REFRESH_TIME } from "../utils/config";
import Login from "./Login";

export default function AppDrawer() {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          //   onClick={toggleDrawer}
          className="text-white"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>About this app</DrawerTitle>
            <DrawerDescription>
              This is a productivity dashboard that combines various features to
              help you stay organized and motivated throughout your day.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="items-center justify-center space-x-2">
              <h3 className="text-xl font-semibold mb-2">Features:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Daily affirmations to boost your mood</li>
                <li>Real-time clock</li>
                <li>Current weather information</li>
                <li>Task management (requires sign-in)</li>
                <li>Calendar integration (requires sign-in)</li>
              </ul>
              <p>
                App will refresh automatically every {REFRESH_TIME / 1000 / 60}{" "}
                minutes
              </p>
              <br />
              <p>
                Sign in with your Google account to access the full features of
                the app, including task management and calendar integration.
              </p>
              <br />
              <p>
                Made with &lt;3 by{" "}
                <a
                  href="https://github.com/JesseHolwell/"
                  target="_blank"
                  className="underline"
                >
                  Jesse
                </a>{" "}
                for his extraordinary, brilliant and compassionate brother
              </p>
              <DrawerFooter>
                <a
                  className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                  href="https://calendar.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src="https://nextjs.org/icons/globe.svg"
                    alt="Globe icon"
                    width={16}
                    height={16}
                  />
                  Go to Calendar →
                </a>
                <a
                  className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                  href="https://tasks.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src="https://nextjs.org/icons/window.svg"
                    alt="Globe icon"
                    width={16}
                    height={16}
                  />
                  Go to Tasks →
                </a>
                {/* {isSignedIn && (
                  <Button
                    // onClick={handleSignoutClick}
                    onClick={onSignOut}
                    variant="destructive"
                    className="mt-4"
                  >
                    Sign Out
                  </Button>
                )} */}

                <Login />

                <DrawerClose asChild>
                  <Button className="mt-2">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
