import { toast as sonnerToast, Toaster as ToasterPrimitive } from "sonner";
import type { ToasterProps } from "sonner";

const defaultOptions: ToasterProps = {
  className:
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden shadow-lg shadow-zinc-950/3 dark:shadow-white/3 transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-full z-1000 border border-zinc-950/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-sm p-4 rounded-2xl whitespace-pre-wrap",
  position: "top-right",
  duration: 3000,
};

const customToast = (
  renderFunc: (t: string | number) => React.ReactElement,
  options: ToasterProps = {},
) => {
  const mergedOptions = { ...defaultOptions, ...options };
  return sonnerToast.custom(renderFunc, mergedOptions);
};

const toast = {
  ...sonnerToast,
  custom: customToast,
};

const Toaster = (props: ToasterProps) => {
  const mergedProps = { ...defaultOptions, ...props };
  return (
    <ToasterPrimitive
      {...mergedProps}
      className='fixed top-8 right-0 z-1000 flex h-fit max-h-screen w-full flex-col-reverse px-6 sm:flex-col md:right-6 md:max-w-105 md:px-0 lg:right-8'
      style={{
        "--width": "420px",
      } as React.CSSProperties}
    />
  );
};

export { toast, Toaster };
