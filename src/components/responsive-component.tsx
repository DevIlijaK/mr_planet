"use client";

import useScreenSize from "../hooks/use-screen-size";

import React, { type ReactNode } from "react";

type ResponsiveComponentProps = {
  children: (props: { size: ReturnType<typeof useScreenSize> }) => ReactNode;
};

const ResponsiveComponent: React.FC<ResponsiveComponentProps> = ({
  children,
}) => {
  const size = useScreenSize();

  return <>{children({ size })}</>;
};

export default ResponsiveComponent;
