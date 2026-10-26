import {sampleByName,btn,icon,progress} from './registry.js';
export const motionExamples=[
 ['Button feedback','Hover and press to see the highlight and 1px press offset.','120ms','standard',sampleByName('Button')],
 ['Switch and selection','Toggle the switch or select an option.','160ms','standard',sampleByName('Switch')+sampleByName('Checkbox & Radio')],
 ['Dialog','Open, close, or press Escape. Focus returns to the trigger.','220ms enter · 160ms exit','decelerate',sampleByName('Dialog')],
 ['Sheet and drawer','Open the edge panel and close it to replay.','280ms enter · 160ms exit','decelerate',sampleByName('Sheet & Drawer')],
 ['Dropdown menu','Open Options. Use arrow keys to navigate and Escape to close.','160ms','decelerate',sampleByName('Dropdown Menu')],
 ['Accordion','Expand a section to see its content enter and chevron rotate.','180ms','standard',sampleByName('Accordion')],
 ['Tabs','Switch panels using clicks or the Left and Right arrow keys.','180ms','standard',sampleByName('Tabs')],
 ['Tooltip','Hover or keyboard-focus the information trigger.','160ms','decelerate',sampleByName('Popover, Hover Card & Tooltip')],
 ['Toast','Trigger feedback to preview its entry and dismissal.','200ms enter · 160ms exit','decelerate',sampleByName('Toast')],
 ['Progress','Change completion and watch the fill update.','240ms','standard',`<div class="stack" data-progress-demo>${progress(25)}<output>25% complete</output><div class="row">${[25,50,100].map(n=>btn(n+'%','secondary',`data-progress="${n}"`)).join('')}</div></div>`],
 ['Loading','Indeterminate loading has a readable status even when motion is disabled.','1000ms spin · 2000ms shimmer','linear',sampleByName('Kbd, Spinner, Skeleton, Separator')],
 ['Carousel','Use the previous and next controls to replace the slide.','180ms','standard',sampleByName('Carousel')],
 ['Chat message','Send a message to preview a new message entering the conversation.','180ms','decelerate',sampleByName('AI: Prompt Composer & Message')],
 ['Number value','Increase the value. The result is announced without moving surrounding layout.','180ms','standard',sampleByName('Number Value')]
].map(([name,description,duration,easing,html],i)=>({name,description,duration,easing,html,id:'motion-'+i}));
export const motionCSS=`:root {
  --duration-fast: 120ms;
  --duration-state: 160ms;
  --duration-panel: 220ms;
  --duration-sheet: 280ms;
  --ease-standard: cubic-bezier(.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, .2, 1);
}
/* Shared component CSS applies these tokens to actual controls. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}`;
