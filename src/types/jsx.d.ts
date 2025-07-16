declare namespace JSX {
  // Allow any intrinsic HTML element
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 