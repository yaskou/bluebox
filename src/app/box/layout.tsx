import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import UploaderDialog from "@/components/UploaderDialog";
import { Boxes } from "lucide-react";
import Link from "next/link";

export default function BoxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-svh flex flex-col">
      <header className="w-full p-2 md:p-4 flex gap-2 md:gap-4">
        <div className="text-3xl grow flex gap-1 font-extrabold tracking-tight md:text-4xl">
          <Boxes className="h-full" />
          <Link className="hidden sm:block" href="/box">
            BlueBox
          </Link>
        </div>
        <UploaderDialog />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit">サインアウト</Button>
        </form>
      </header>
      <div className="size-full">{children}</div>
    </div>
  );
}
