import {components,btn,icon,sampleByName,field,chart} from './registry.js';
import {extraExamples} from './examples.js';
const behavior={
'data-toggle':'Toggles aria-pressed when activated.','data-step':'Adds this numeric increment and clamps to the input min/max.','data-tabs':'Scopes tab buttons and their associated panels.','data-tab':'Selects the matching data-panel; supports arrow-key navigation.','data-panel':'Panel associated with a tab value.','data-open-dialog':'Opens the sibling native dialog.','data-month':'Moves the calendar by the specified number of months.','data-carousel-step':'Moves backward or forward through three slides.','data-chat-form':'Appends a local demonstration message and response.','data-toast':'Shows this text in a temporary live-region notification.','data-reaction':'Toggles a reaction and adjusts its count.','data-rating':'Sets the selected rating value.','data-move-task':'Moves the task to the next column; updates counts.','data-select-all':'Toggles the table row checkboxes.','data-format':'Applies the named editing command to the current selection.','data-otp':'Enables numeric input, focus movement and paste distribution.','data-context-target':'Enables right-click and Shift+F10 access to the menu.','data-custom-select':'Scopes the custom select label and form value.','data-select-option':'Sets the custom select’s visible and form values.','data-dismiss':'Removes the containing inline notification or attachment.','data-suggest':'Inserts this text into the nearby prompt composer.','data-scroll-bottom':'Scrolls the associated message history to its latest entry.','data-copy-code':'Copies the associated code block.','data-copy-message':'Copies the message text.','data-regenerate':'Replaces the response with an alternate local demonstration.','data-command':'Opens documentation search; the standalone runtime supplies a local fallback.','data-attach':'Opens the adjacent file picker; does not upload files.','data-emoji':'Selects an emoji and updates the output.','data-emoji-search':'Filters available emoji by keyword.','data-increment-number':'Increments the displayed count.','data-page':'Selects a demonstration page; connect real pagination data in your app.','data-clear-selection':'Clears the selected preview items.','data-side':'Anchors a sheet to left, right, top or bottom.'};
export function hooksFor(c){const hooks=[...new Set([...c.html.matchAll(/\b(data-[\w-]+)(?:="[^"]*")?/g)].map(m=>m[1]))];const classes=[...new Set([...c.html.matchAll(/class="([^"]+)"/g)].flatMap(m=>m[1].split(' ').filter(s=>s.startsWith('s-'))))];return [...classes.map(s=>['.'+s,'CSS class','Applies the '+s.slice(2).replaceAll('-',' ')+' surface or layout.']),...hooks.map(h=>[h,'HTML attribute',behavior[h]||'Scopes the '+h.slice(5).replaceAll('-',' ')+' element used by the local runtime.'])]}
export function guidance(c){let notes=[];const h=c.html;
if(h.includes('type="radio"'))notes.push('Use a shared name for one radio group and a different name for each independent group. Arrow keys change the selected option.');
if(h.includes('type="checkbox"'))notes.push('Space toggles the focused checkbox or switch. Disabled examples are unavailable to pointer and keyboard interaction.');
if(h.includes('data-tabs'))notes.push('Use Left/Right, Home and End to move between tabs. Each tab is associated with its panel and only the active tab is in the Tab sequence.');
if(h.includes('<dialog'))notes.push('The native dialog contains focus, closes on Escape and returns focus to its trigger. A visible heading labels the modal.');
if(h.includes('<details'))notes.push('Enter or Space opens the disclosure. Menus also support Up/Down and Escape. Disclosure content is only reachable when open.');
if(h.includes('type="range"'))notes.push('Use arrow keys to adjust the range. Expose its label, current value and bounds; do not require dragging.');
if(h.includes('draggable'))notes.push('The move action is the keyboard alternative to drag and drop. Column counts and task status update after either action.');
if(h.includes('<table'))notes.push('Column headers remain available to assistive technology. On small screens, scroll the table horizontally without clipping controls.');
if(c.group==='Charts')notes.push('Charts use illustrative data. Keep a textual summary or data table alongside color-coded series, and provide a label for each meaningful point.');
if(h.includes('data-chat-form'))notes.push('Sending requires a nonempty message. The response is a local simulation, not an external AI request. New content uses a live region.');
if(h.includes('type="file"'))notes.push('The native file picker is the alternative to drag and drop. File selection does not send data to a server.');
if(h.includes('data-toast'))notes.push('Notifications use a polite live region. Do not put critical instructions only in a temporary toast.');
if(!notes.length)notes.push(c.group==='Layout'?'Keep a logical reading order as the layout changes. Test the content at 200% zoom and narrow widths.':'Preserve the visible content and labels shown in the example. Decorative icons should remain hidden from assistive technology.');
notes.push('The global motion switch and operating-system reduced-motion preference disable nonessential animation.');return notes;}
// Add meaningful alternate states alongside the primary example for each family.
export const stateExamples={...extraExamples};
for(const c of components){if(stateExamples[c.slug])continue;const h=c.html;
if(c.group==='Forms'&&/<input|<textarea|<select/.test(h)){stateExamples[c.slug]=[{title:'Disabled controls',html:h.replace(/<(input|textarea|select)(\s)/g,'<$1 disabled$2').replace(/<button(\s)/g,'<button disabled$1')}];}
else if(c.group==='Charts'){stateExamples[c.slug]=[{title:'No data',html:`<div class="s-empty">${icon('chart-no-axes-combined',32)}<h3>No activity in this period.</h3><p>Try a wider date range before drawing conclusions.</p></div>`},{title:'Loading data',html:'<div class="stack" aria-busy="true" aria-label="Loading chart"><span class="s-spinner" role="status" aria-label="Loading"></span><div class="s-skeleton"></div><div class="s-skeleton"></div></div>'}];}
else if(c.group==='Overlays'){stateExamples[c.slug]=[{title:'With supporting context',html:`<div class="stack"><h3>Workspace settings</h3><p class="muted">Open the control below to review additional options.</p>${h}</div>`}];}
else if(c.group==='Actions'){stateExamples[c.slug]=[{title:'Disabled actions',html:h.replace(/<button(\s)/g,'<button disabled$1')}];}
else if(c.group==='AI'){stateExamples[c.slug]=[{title:'Unavailable service',html:`<div class="s-alert" role="status">${icon('wifi-off')}<div><strong>Assistant is unavailable</strong><p>Your draft is safe. Reconnect your service before sending again.</p></div></div>`}];}
else if(c.group==='Data display'){stateExamples[c.slug]=[{title:'Empty collection',html:`<div class="s-empty">${icon('inbox',32)}<h3>Nothing to display yet.</h3><p>This ${c.name.toLowerCase()} appears when the relevant content is available.</p></div>`}];}
else if(c.group==='Feedback'){stateExamples[c.slug]=[{title:'In context',html:`<section class="s-card"><h3>Workspace update</h3><p>Keep feedback near the action or content it describes.</p>${h}</section>`}];}
else if(c.group==='Navigation'){stateExamples[c.slug]=[{title:'Within a content panel',html:`<section class="s-card"><span class="eyebrow">SANOA WORKSPACE</span>${h}</section>`}];}
else stateExamples[c.slug]=[{title:'Within a constrained panel',html:`<div class="s-card" style="max-width:360px;width:100%">${h}</div>`}];
}
export const auditChanges=[
['Themes and Delete icons','brand-colors','Fixed the missing Lucide Delete icon, synchronized style controls and saved preferences, and made Satin, Soft, Glass and Mono visibly distinct in both themes.'],
['Video showcase','block/video-with-transcript','Added a playable local brand demonstration with captions, playback controls and a matching transcript.'],
['Motion','motion','Added 14 individual examples and shared motion tokens; transitions now apply to real components, with reduced-motion support.'],
['Foundation documentation','theming','Separated colors, brand palettes, theming, density, radius and elevation guidance.'],
['Component reference','components','Replaced generic API rows with actual HTML classes and runtime hooks; added contextual keyboard guidance and alternate state examples to every family.'],
['Distinct component examples','components/composed-chart','Separated duplicate examples: composed/pie charts, context menu, sheet sides, labels, selects, sidebar, chat patterns and disclosures.'],
['Pricing','block/pricing-three-tiers','Added distinct Starter, Professional and Business plans with monthly/yearly billing.'],
['Commerce','block/cart-flyout','Replaced project-details placeholder with a cart, quantities, removal and subtotal; added catalog filtering and gallery crops.'],
['Invoices','block/table-invoices','Replaced the projects table with invoice-specific fields and CSV downloads.'],
['Block variants','blocks','Added distinct hero layouts, double marquee, timeline variants, testimonials, footers, editorial layouts, empty states and consent placements.'],
['Sanoa templates','templates','Connected chart switching, task sorting, completion counts, week navigation, inbox filtering and local thread switching.'],
['Navigation and accessibility','components/tabs','Fixed local anchor routing, tab/panel relationships, disclosure keyboard handling, dialog labels and keyboard Kanban movement.'],
['Icons','icons','Removed the 240-icon browsing dead end by adding pagination.'],
['Source package','installation','Included new styles and runtime modules in the build and downloadable source.']
];
