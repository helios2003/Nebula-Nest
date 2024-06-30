import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function Navbar() {
    return (
        <Menubar className="bg-zinc-950 border-x-stone-900 w-full h-12 flex justify-between items-center px-4 mb-4">
          <MenubarMenu>
            <MenubarTrigger className="text-white text-xl font-thin cursor-pointer hover:text-indigo-700">Nebula-Nest</MenubarTrigger>
            <div className="flex space-x-4">
            <MenubarTrigger className="text-white text-xl font-thin cursor-pointer hover:text-indigo-700"><a href="https://github.com/helios2003/Nebula-Nest" target="blank">GitHub</a></MenubarTrigger>
            <MenubarTrigger className="text-white text-xl font-thin cursor-pointer hover:text-indigo-700"><a href="mailto:ankitdash2019@gmail.com">Contact</a></MenubarTrigger>
            <MenubarTrigger className="text-white text-xl font-thin cursor-pointer hover:text-indigo-700">Features</MenubarTrigger>
            </div>
          </MenubarMenu>
        </Menubar>
    )
}