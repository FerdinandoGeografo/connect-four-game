// Files imported with `with { loader: 'text' }` (see app.ts).
declare module '*.svg' {
  const content: string;
  export default content;
}
