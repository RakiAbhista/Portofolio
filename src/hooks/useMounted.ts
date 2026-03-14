import { useState, useEffect } from "react";

/**
 * Custom hook to handle mounted state for preventing hydration mismatches
 * 
 * Usage:
 * const isMounted = useIsMounted();
 * 
 * {isMounted && <ComponentThatNeedsClientSideState />}
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

/**
 * Hook for theme-dependent rendering with mounted state
 * Prevents hydration mismatch when using next-themes
 * 
 * Usage:
 * const { theme, isMounted } = useThemeWithMounted();
 * 
 * {isMounted ? (
 *   theme === 'dark' ? <DarkComponent /> : <LightComponent />
 * ) : (
 *   <DefaultComponent />
 * )}
 */
export function useThemeWithMounted() {
  const { theme } = require("next-themes").useTheme();
  const isMounted = useIsMounted();

  return { theme, isMounted };
}
