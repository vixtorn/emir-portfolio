import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

import styles from "./ManifestoLab.module.css";

type ManifestoStatementProps = {
  children: ReactNode;
  className: string;
  heading?: "h2" | "p";
} & Omit<ComponentPropsWithoutRef<"p">, "children" | "className">;

const ManifestoStatement = forwardRef<HTMLElement, ManifestoStatementProps>(
  ({ children, className, heading: Heading = "p", ...props }, ref) => (
    <Heading ref={ref as never} className={`${styles.cut} ${className}`} {...props}>
      <span>{children}</span>
    </Heading>
  ),
);

ManifestoStatement.displayName = "ManifestoStatement";

export default ManifestoStatement;
