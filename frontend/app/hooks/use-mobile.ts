import * as React from "react";

/**
 * Matches Tailwind's `lg` breakpoint, which is where the layout switches between
 * the off-canvas drawer and the persistent in-flow sidebar column.
 */
const MOBILE_BREAKPOINT = 1024;

/**
 * Reports whether the viewport is below the `lg` breakpoint.
 *
 * Returns `false` on the server and during the first client render so the markup
 * matches what SSR produced; the real value is applied in an effect.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(query.matches);
    };

    query.addEventListener("change", onChange);
    onChange();

    return () => query.removeEventListener("change", onChange);
  }, []);

  return isMobile ?? false;
}
