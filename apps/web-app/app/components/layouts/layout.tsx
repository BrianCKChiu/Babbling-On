import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Menu from "@/assets/icons/menu.svg";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { logout } from "@/auth";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex w-full h-[110px] px-6 justify-between ">
        {/* left buttons  */}
        <div className="flex items-center  flex-0">
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent
              side={"left"}
              className="flex flex-col justify-between space-y-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <h1 className="self-center text-2xl font-bold">Babbling On</h1>
              <div className="flex flex-col flex-1 justify-center">
                <Button
                  disabled
                  variant="ghost"
                  className="py-6 text-end font-semibold text-xl "
                >
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  className="py-6 font-semibold text-xl"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  My Courses
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* right buttons */}
        <div className=" flex-1 flex flex-row items-center w-20 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-row items-center">
                <div className="max-w-[180px] w-fit h-12 flex items-center pr-6 font-semibold text-lg text-ellipsis mr-[-10px] whitespace-nowrap overflow-clip rounded-l-xl px-3 py-2	bg-slate-50 select-none border border-slate-200">
                  {user?.displayName ?? ""}
                </div>
                <div className="w-16 h-16 bg-slate-50 rounded-full shadow-md border border-slate-200"></div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => logout()}>
                <div>Logout</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 w-full lg:px-20 md:px-16 px-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
