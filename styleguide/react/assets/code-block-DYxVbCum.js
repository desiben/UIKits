import{st as e}from"./react-BaQ5Op-n.js";import{t}from"./code-block-DhlKB5il.js";var n=e(),r=`import { Button } from "@/components/ui/button"

// Save the current draft
export function Save({ onSave }: { onSave: () => void }) {
  return <Button variant="primary" onClick={onSave}>Save changes</Button>
}`,i=`  --brand-600: oklch(0.55 0.17 250);
  --brand-600: oklch(0.58 0.2 40);
  --bg-primary: var(--brand-600);`;function a(){return(0,n.jsxs)(`div`,{className:`mx-auto flex max-w-2xl flex-col gap-4`,children:[(0,n.jsx)(t,{language:`tsx`,filename:`save.tsx`,showLineNumbers:!0,highlightLines:[5],code:r}),(0,n.jsxs)(`div`,{className:`grid gap-4 sm:grid-cols-2`,children:[(0,n.jsx)(t,{language:`css`,filename:`tokens.css`,removedLines:[1],addedLines:[2],code:i}),(0,n.jsx)(t,{hideHeader:!0,language:`sh`,code:`# install the component
npx facetui@latest add code-block`})]})]})}export{a as default};