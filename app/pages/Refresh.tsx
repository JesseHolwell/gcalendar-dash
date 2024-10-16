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
import { Menu, RefreshCw } from "lucide-react";
import Image from "next/image";

export default function Refresh() {
  return (
    <Button
      variant="ghost"
      // size="icon"
      //   onClick={toggleDrawer}
      // className="text-white"
    >
      <RefreshCw className="h-6 w-6" />
    </Button>
  );
}
