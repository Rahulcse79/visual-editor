import React from "react";

export default function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      className={`inline-block align-middle fill-current ${className}`}
      width={`${size}px`}
      height={`${size}px`}
      aria-hidden="true"
    >
      <use xlinkHref={`/icons/solid.svg#${name}`} />
    </svg>
  );
}
