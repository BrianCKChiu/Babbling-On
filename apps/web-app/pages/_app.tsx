import { auth } from "@/components/firebase";
import RootLayout from "@/components/layouts/layout";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Theme } from "@radix-ui/themes";
import "../app/globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [user, isAuthLoading] = useAuthState(auth);
  const router = useRouter();

  // redirect to login page if user is not logged in
  useEffect(() => {
    if (isAuthLoading) return;
    if (router.pathname.endsWith("/auth")) return;
    if (user === null) {
      router.push("/auth");
    } else if (router.asPath.endsWith("/")) {
      router.push("/dashboard");
    }
  }, [isAuthLoading, router, user]);

  function renderLayout() {
    if (router.pathname.endsWith("/auth")) return <Component {...pageProps} />;
    return (
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    );
  }
  return (
    <Theme>
      {renderLayout()}
      <Toaster />
    </Theme>
  );
}
