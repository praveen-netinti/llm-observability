import * as Tooltip from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import { jetBrainsMono, openRunde } from "@/lib/fonts";
import { cn } from "@/utils";

import { ConsoleBanner } from "@/components/console-banner";

import "./globals.css";

import { SplashScreen } from "@/components/splash-screen";
import { NotificationProvider } from "@/components/ui/notification-provider";

export const metadata: Metadata = {
  title: "NeoSigma - LLM Observability",
  description:
    "Trace, debug, and monitor LLM applications with interactive traces, Slack alerts, issues, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(openRunde.variable, jetBrainsMono.variable)}
    >
      <body className='font-sans antialiased'>
        <ConsoleBanner />
        <NotificationProvider />
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <Tooltip.Provider delayDuration={600}>
            <SplashScreen>{children}</SplashScreen>
          </Tooltip.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
