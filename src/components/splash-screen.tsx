'use client';

import * as React from 'react';
import { RiLoader2Line } from '@remixicon/react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = React.useState(true);
  const [showChildren, setShowChildren] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowChildren(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className='bg-bg-white-0 fixed inset-0 z-50 grid place-items-center'
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Image
                width={1024}
                height={470.25}
                src='/splash-light.png'
                alt=''
                className='dark:hidden'
                priority
              />
              <Image
                width={1024}
                height={470.25}
                src='/splash-dark.png'
                alt=''
                className='hidden dark:block'
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className='bg-bg-soft-200 text-text-sub-600 absolute bottom-8 flex h-8 items-center gap-1 rounded-xl px-2 pr-3 text-[13px]'
            >
              <RiLoader2Line className='size-4 animate-spin' />
              Loading...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showChildren && children}
    </>
  );
}
