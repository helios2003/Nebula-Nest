import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function Navbar() {
    return (
        <Menubar className="bg-zinc-950 border-x-stone-900 w-full h-12 flex justify-between items-center px-4 mb-4">
          <MenubarMenu>
            <MenubarTrigger className="text-white text-xl font-thin cursor-pointer hover:text-indigo-700">Nebula-Nest</MenubarTrigger>
            <div className="flex space-x-4">
            <MenubarTrigger className="text-white text-xl font-thin cursor-pointer hover:text-indigo-700">GitHub</MenubarTrigger>
            <MenubarTrigger className="text-white text-xl font-thin cursor-pointer hover:text-indigo-700">Contact</MenubarTrigger>
            <MenubarTrigger className="text-white text-xl font-thin cursor-pointer hover:text-indigo-700">Features</MenubarTrigger>
            </div>
          </MenubarMenu>
        </Menubar>
    )
}
