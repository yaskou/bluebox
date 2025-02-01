import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth(); // ログイン状況を取得

  return (
    <main className="h-svh flex flex-col justify-center items-center gap-8">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        BlueBoxにようこそ
      </h1>
      {session ? (
        <Button asChild className="w-60">
          <Link href="/box">ドライブに移動</Link>
        </Button>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google"); // googleの認証画面に遷移
          }}
          className="w-60"
        >
          <Button className="w-60" type="submit">
            Googleでログイン
          </Button>
        </form>
      )}
    </main>
  );
}
