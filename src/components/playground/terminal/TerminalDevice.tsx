"use client";

import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import styles from "./TerminalDevice.module.css";

type TerminalDeviceContextValue = {
  isPowered: boolean;
  setTerminalFocused: (isFocused: boolean) => void;
};

const TerminalDeviceContext = createContext<TerminalDeviceContextValue | null>(null);

export function useTerminalDevice() {
  return useContext(TerminalDeviceContext);
}

type TerminalDeviceProps = {
  children: ReactNode;
  onPowerChange?: (isPowered: boolean) => void;
  className?: string;
};

export default function TerminalDevice({
  children,
  onPowerChange,
  className,
}: TerminalDeviceProps) {
  const [isPowered, setIsPowered] = useState(true);
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);

  const setTerminalFocused = useCallback((isFocused: boolean) => {
    setIsTerminalFocused(isFocused);
  }, []);

  const contextValue = useMemo(
    () => ({ isPowered, setTerminalFocused }),
    [isPowered, setTerminalFocused],
  );

  const togglePower = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const nextPower = !isPowered;

    if (isPowered) setIsTerminalFocused(false);

    setIsPowered(nextPower);
    onPowerChange?.(nextPower);
  };

  return (
    <TerminalDeviceContext.Provider value={contextValue}>
      <section
        aria-label="ET-01 lab terminal device"
        className={`${styles.device}${className ? ` ${className}` : ""}`}
        data-focused={isTerminalFocused || undefined}
        data-powered={isPowered || undefined}
      >
        <div aria-hidden="true" className={styles.depthPlane} />
        <div className={styles.housing}>
          <div aria-hidden="true" className={styles.topHousing}>
            <span>EMIR LABORATORY SYSTEMS</span>
            <span>ET SERIES / REV 01</span>
          </div>

          <div className={styles.screenBay}>
            <span aria-hidden="true" className={`${styles.screw} ${styles.screwTopLeft}`} />
            <span aria-hidden="true" className={`${styles.screw} ${styles.screwTopRight}`} />
            <span aria-hidden="true" className={`${styles.screw} ${styles.screwBottomLeft}`} />
            <span aria-hidden="true" className={`${styles.screw} ${styles.screwBottomRight}`} />
            <div className={styles.screenRecess}>{children}</div>
          </div>

          <div className={styles.controlChin}>
            <div className={styles.deviceLabels}>
              <span>LAB TERMINAL / 01</span>
              <span>MODEL ET-01</span>
            </div>
            <div aria-hidden="true" className={styles.vents}>
              {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
            </div>
            <div className={styles.controls}>
              <span
                aria-label={isPowered ? "Terminal power on" : "Terminal power off"}
                className={styles.statusLed}
                role="img"
              />
              <button
                aria-pressed={isPowered}
                className={styles.powerButton}
                type="button"
                onClick={togglePower}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <span className={styles.powerGlyph} aria-hidden="true" />
                <span className="sr-only">Turn terminal {isPowered ? "off" : "on"}</span>
              </button>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className={styles.base}>
          <span className={styles.foot} />
          <span className={styles.foot} />
        </div>
      </section>
    </TerminalDeviceContext.Provider>
  );
}
