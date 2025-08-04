import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
      {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 lg:grid">
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Background image - blurred and translucent */}
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
              src="/images/logo/Reinforcer-log-in-page.png"
              alt="Background"
            />

            {/* Foreground image with fade effect */}
            <div className="relative z-10 max-w-full max-h-full">
              <img
                className="w-full h-full object-contain"
                src="/images/logo/Reinforcer-log-in-page.png"
                alt="Logo"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 5%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0.6) 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 5%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0.6) 95%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 5%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0.6) 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 5%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0.6) 95%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in'
                }}
              />
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}