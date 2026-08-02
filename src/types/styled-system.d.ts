declare module "styled-system" {
  export const space: (props: unknown) => any;
  export const flexbox: (props: unknown) => any;
  export const typography: (props: unknown) => any;
}

declare module "@styled-system/should-forward-prop" {
  const shouldForwardProp: (prop: string) => boolean;
  export default shouldForwardProp;
}
