/* Facet UI v1.2 registry — AI, Feedback, Layout, Forms, Navigation, Overlays. */
(function () {
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  const add = (o) => window.FACET_REGISTRY.push({ isNew: true, ...o });
  const ai = `<span class="ai-mark">${i("sparkles", "icon-sm")}</span>`;
  const actions = `<div class="msg-actions"><button class="btn btn-ghost btn-sm icon-btn" data-action="copy" aria-label="Copy">${i("copy", "icon-sm")}</button><button class="btn btn-ghost btn-sm icon-btn" data-action="up" aria-pressed="false" aria-label="Good response">${i("thumbs-up", "icon-sm")}</button><button class="btn btn-ghost btn-sm icon-btn" data-action="down" aria-pressed="false" aria-label="Bad response">${i("thumbs-down", "icon-sm")}</button><button class="btn btn-ghost btn-sm icon-btn" data-action="regenerate" aria-label="Regenerate">${i("rotate-ccw", "icon-sm")}</button></div>`;
  const star = `<svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`;
  const composer = (extra = "") => `<div class="composer prompt-input" style="width:100%;max-width:640px;margin:auto">
  ${extra}<textarea rows="1" placeholder="Ask Facet AI anything…" aria-label="Message"></textarea>
  <div class="composer-bar">
    <button class="btn btn-ghost btn-sm icon-btn" aria-label="Attach">${i("paperclip")}</button>
    <button class="model hide-sm">${i("sparkles", "icon-sm")} Facet Pro ${i("chevron-down", "icon-sm")}</button>
    <span class="grow"></span>
    <button class="btn btn-ghost btn-sm icon-btn" aria-label="Voice">${i("mic")}</button>
    <button class="btn btn-sm icon-btn send" aria-label="Send" disabled>${i("arrow-up")}</button>
  </div>
</div>`;

  /* ------------------------------ AI ------------------------------ */
  add({ slug: "chat-conversation", name: "Chat Conversation", group: "AI", figma: "Chat / Conversation · full chat",
    desc: "The scrolling container for a chat: messages, reasoning, tool calls and the composer, with a jump-to-latest button when you scroll up.",
    examples: [{ title: "Full chat", layout: "block", html: `<div class="card" style="max-width:720px;margin:auto;height:520px;display:flex;flex-direction:column;overflow:hidden">
  <div class="chat-conversation" style="flex:1">
    <div class="chat-conversation-content">
      <div class="chat-msg" data-role="user"><div class="chat-msg-body"><div class="chat-msg-text">Which enterprise deals are at risk this quarter?</div></div></div>
      <div class="chat-msg">${ai}<div class="chat-msg-body">
        <details class="cot"><summary>${i("brain", "icon-sm")} Thought for 4 seconds ${i("chevron-down", "icon-sm chev")}</summary><ol class="cot-steps"><li class="cot-step" data-state="done"><span class="node">${i("check")}</span><div><b>Searched CRM</b><small>Deals over $50k closing in Q4</small></div></li><li class="cot-step" data-state="done"><span class="node">${i("check")}</span><div><b>Checked usage</b><small>Seat usage dropped for 2 accounts</small></div></li></ol></details>
        <div class="chat-msg-text markdown"><p><strong>Two deals need attention</strong> <a class="cite" href="#">1</a></p><ul><li><strong>Globex</strong> — $12,950, seat usage down 31%.</li><li><strong>Umbrella</strong> — $8,400, invoice 38 days overdue.</li></ul></div>
        <div class="chat-sources"><a class="chat-source" href="#"><span class="fav">S</span><span>Salesforce · Q4 pipeline</span></a><a class="chat-source" href="#"><span class="fav">M</span><span>Mixpanel · seat usage</span></a></div>
        ${actions}
      </div></div>
      <div class="chat-msg" data-role="user"><div class="chat-msg-body"><div class="chat-msg-text">Draft a check-in email to Globex.</div></div></div>
      <div class="chat-msg">${ai}<div class="chat-msg-body"><span class="chat-loader"><span class="typing"><i></i><i></i><i></i></span></span></div></div>
    </div>
    <button class="btn btn-outline btn-sm chat-scroll-btn" hidden>${i("arrow-down", "icon-sm")} Latest</button>
  </div>
  <div style="padding:12px;border-top:1px solid var(--border-subtle)">${composer()}</div>
</div>` }],
    react: `<ChatConversation><ChatConversation.Content>{messages.map(…)}</ChatConversation.Content><ChatConversation.ScrollButton /></ChatConversation>`,
    api: [["chat-conversation · chat-conversation-content", "class", "Scroll viewport + centered column (max 720px)"], ["chat-scroll-btn", "class", "Shows when you're more than 60px from the bottom"]],
    a11y: ["Give the message list role=log and aria-live=polite so new replies are announced."] });

  add({ slug: "chat-message", name: "Chat Message", group: "AI", figma: "Chat / Message · user · assistant · bubble",
    desc: "A message from the user or the assistant. Assistant messages are plain by default and can use a bubble; user messages are right-aligned bubbles.",
    examples: [{ title: "Roles & variants", layout: "block", html: `<div class="stack" style="--gap:20px;max-width:640px;margin:auto">
  <div class="chat-msg" data-role="user"><span class="avatar avatar-sm av-1">MR</span><div class="chat-msg-body"><div class="chat-msg-meta"><b>Maya</b><time>9:41</time></div><div class="chat-msg-text">Summarize this week's revenue changes.</div></div></div>
  <div class="chat-msg">${ai}<div class="chat-msg-body"><div class="chat-msg-meta"><b>Facet AI</b><time>9:41</time></div><div class="chat-msg-text">MRR grew <strong>4.6%</strong> to $248,920. Expansion drove most of it — Northwind added 40 seats.</div>${actions}</div></div>
  <div class="chat-msg" data-variant="bubble">${ai}<div class="chat-msg-body"><div class="chat-msg-text">Bubble variant for compact assistant surfaces like a support widget.</div></div></div>
</div>` }],
    react: `<ChatMessage role="assistant" variant="bubble"><ChatMessage.Content>…</ChatMessage.Content><ChatMessageActions /></ChatMessage>`,
    api: [["data-role", "user | assistant", "Alignment and bubble"], ["data-variant", "bubble", "Bubble for assistant messages"], ["chat-msg-meta", "class", "Name + time"]], a11y: ["Label who said what for screen readers (visible name or sr-only text)."] });

  add({ slug: "chat-message-actions", name: "Chat Message Actions", group: "AI", figma: "Chat / Message Actions",
    desc: "Copy, rate and regenerate controls under an assistant reply. Thumbs are mutually exclusive.",
    examples: [{ title: "Default", html: actions }],
    react: `<ChatMessageActions onCopy={…} onFeedback={…} onRegenerate={…} />`, api: [["[data-action]", "copy · up · down · regenerate", "Built-in behaviours"]], a11y: ["Icon-only buttons have aria-labels; rating buttons expose aria-pressed."] });

  add({ slug: "chain-of-thought", name: "Chain Of Thought", group: "AI", figma: "Chat / Chain of Thought · step states",
    desc: "Shows the assistant's reasoning as collapsible steps — done, active or pending — with optional source chips.",
    examples: [{ title: "Running", layout: "block", html: `<details class="cot" open style="max-width:520px;margin:auto">
  <summary><span class="text-shimmer">Researching your pipeline…</span> ${i("chevron-down", "icon-sm chev")}</summary>
  <ol class="cot-steps">
    <li class="cot-step" data-state="done"><span class="node">${i("check")}</span><div><b>Searched CRM</b><small>Found 14 deals over $50k closing in Q4</small><span class="chip">${i("database", "icon-sm")} Salesforce</span></div></li>
    <li class="cot-step" data-state="done"><span class="node">${i("check")}</span><div><b>Compared seat usage</b><small>2 accounts dropped more than 25%</small></div></li>
    <li class="cot-step" data-state="active"><span class="node"></span><div><b>Checking open invoices</b><small>Stripe · 3 of 14 accounts</small></div></li>
    <li class="cot-step"><span class="node">${i("circle-dot")}</span><div><b>Write summary</b></div></li>
  </ol>
</details>` }],
    react: `<ChainOfThought open><ChainOfThought.Step status="done" title="Searched CRM" /></ChainOfThought>`, api: [["cot-step[data-state]", "done · active · (pending)", "Step state"]], a11y: ["Collapsed by default once the answer arrives; it's a native <details>."] });

  add({ slug: "chat-tool", name: "Chat Tool", group: "AI", figma: "Chat / Tool Call · running · done · approval",
    desc: "A tool call made by the agent, with its input and output, a status, and an approval gate for sensitive actions.",
    examples: [{ title: "Done & needs approval", layout: "block", html: `<div class="stack" style="--gap:12px;max-width:560px;margin:auto">
  <details class="chat-tool"><summary><span class="tool-ico">${i("database")}</span><code>crm.search_deals</code><span class="status" data-state="done">${i("check", "icon-sm")} 14 results</span></summary><pre>{ <span class="k">"stage"</span>: "negotiation", <span class="k">"minValue"</span>: 50000, <span class="k">"closeBy"</span>: "2026-12-31" }</pre></details>
  <div class="chat-tool" data-state="pending"><div class="chat-tool-head"><span class="tool-ico">${i("send")}</span><code>email.send</code><span class="status" data-state="pending">${i("hourglass", "icon-sm")} Needs approval</span></div>
    <div class="chat-tool-approval"><p>Send <b>“Checking in on your renewal”</b> to <b>ops@globex.com</b>?</p><div class="row"><button class="btn btn-outline btn-sm" data-deny>Deny</button><button class="btn btn-sm" data-approve>${i("check", "icon-sm")} Allow</button></div></div></div>
</div>` }],
    react: `<ChatTool name="email.send" state="approval-requested" onApprove={…} onDeny={…} input={args} />`, api: [["status[data-state]", "done · pending · error", "Status color"], ["[data-approve] / [data-deny]", "button", "Fires facet:approval {approved}"]], a11y: ["Approval buttons are real buttons and clearly say what will happen."] });

  add({ slug: "chat-source", name: "Chat Source", group: "AI", figma: "Chat / Source · Citation",
    desc: "Source chips and inline numbered citations that show where an answer came from.",
    examples: [{ title: "Sources & citations", layout: "block", html: `<div class="stack" style="--gap:12px;max-width:560px;margin:auto">
  <p class="t-body-md">Northwind's renewal is on track <a class="cite" href="#">1</a> and usage is up 18% this month <a class="cite" href="#">2</a>.</p>
  <div class="chat-sources"><a class="chat-source" href="#"><span class="fav">1</span><span>salesforce.com · Northwind renewal</span></a><a class="chat-source" href="#"><span class="fav">2</span><span>mixpanel.com · Seat usage</span></a><a class="chat-source" href="#"><span class="fav">+3</span><span>More sources</span></a></div>
</div>` }],
    react: `<ChatSource href={url} index={1} title="Northwind renewal" />`, api: [["chat-source · fav", "class", "Chip + favicon/index"], ["cite", "class", "Inline numbered citation"]], a11y: ["Citations link to their source; give them aria-label='Source 1'."] });

  add({ slug: "chat-attachment", name: "Chat Attachment", group: "AI", figma: "Chat / Attachment · file · image · uploading",
    desc: "File and image previews for the composer and messages, with type, size, upload progress and remove.",
    examples: [{ title: "Files & images", html: `<div class="chat-attachments">
  <div class="chat-attachment"><span class="thumb">${i("file-text")}</span><div><b>Q4-pricing.pdf</b><span>PDF · 2.4 MB</span></div><button class="btn btn-ghost btn-sm icon-btn x" aria-label="Remove">${i("x", "icon-sm")}</button></div>
  <div class="chat-attachment" style="--tone:var(--green-600)"><span class="thumb">${i("file-spreadsheet")}</span><div><b>pipeline.csv</b><span>CSV · 84 KB</span></div><button class="btn btn-ghost btn-sm icon-btn x" aria-label="Remove">${i("x", "icon-sm")}</button></div>
  <div class="chat-attachment" data-state="uploading" style="--tone:var(--blue-600)"><span class="thumb">${i("image")}</span><div><b>dashboard.png</b><span>Uploading… 64%</span></div><div class="progress progress-sm"><span style="--value:64%"></span></div></div>
  <div class="chat-attachment image"><span class="thumb" style="background:linear-gradient(135deg,var(--brand-400),var(--lagoon-500))"></span></div>
</div>` }],
    react: `<ChatAttachment file={file} progress={64} onRemove={…} />`, api: [["--tone", "CSS var", "Thumbnail color by file type"], ["data-state", "uploading", "Shows progress"], [".image", "class", "Square image preview"]], a11y: ["Remove buttons are labeled; announce upload completion."] });

  add({ slug: "chat-list-view", name: "Chat List View", group: "AI", figma: "Chat / Thread List",
    desc: "Thread rows for a chat sidebar, grouped by date, with unread dots and a hover menu.",
    examples: [{ title: "Sidebar threads", html: `<div class="card" style="width:300px;padding:8px">
  <button class="btn btn-outline btn-block btn-sm" style="margin-bottom:6px">${i("square-pen")} New chat</button>
  <div class="chat-list">
    <div class="chat-list-label">Today</div>
    <a class="chat-thread" href="#" aria-current="true"><div class="grow"><b>At-risk enterprise deals</b><span>Two deals need attention…</span></div><time>9:41</time></a>
    <a class="chat-thread" href="#"><div class="grow"><b>Draft Globex email</b><span>Here's a friendly check-in…</span></div><span class="unread"></span></a>
    <div class="chat-list-label">Previous 7 days</div>
    <a class="chat-thread" href="#"><div class="grow"><b>Q4 board deck outline</b><span>Slide 1: Highlights…</span></div><button class="btn btn-ghost btn-sm icon-btn more" aria-label="More">${i("more-horizontal", "icon-sm")}</button></a>
    <a class="chat-thread" href="#"><div class="grow"><b>SQL for churn cohort</b><span>SELECT account_id…</span></div><time>Mon</time></a>
  </div>
</div>` }],
    react: `<ChatListView groups={byDate(threads)} selectedKey={id} />`, api: [["chat-thread[aria-current]", "attribute", "Open thread"], [".unread", "class", "Unread dot"]], a11y: ["Use a nav landmark labeled 'Chats'."] });

  add({ slug: "chat-loader", name: "Chat Loader", group: "AI", figma: "Chat / Loader · typing · thinking · pulse",
    desc: "Waiting states while the assistant works: typing dots, a shimmering status and a pulsing dot.",
    examples: [{ title: "Loaders", html: `<span class="chat-loader"><span class="typing"><i></i><i></i><i></i></span></span>
<span class="chat-loader"><span class="spinner"></span><span class="text-shimmer">Thinking…</span></span>
<span class="chat-loader"><span class="pulse-dot"></span>Searching 3 sources</span>` }],
    react: `<ChatLoader variant="typing" />`, api: [["typing · text-shimmer · pulse-dot", "class", "Loader styles"]], a11y: ["Pair with aria-busy=true on the message list."] });

  add({ slug: "prompt-input", name: "Prompt Input", group: "AI", figma: "Prompt Input · default · attachments · recording",
    desc: "The composer: grows with your text, sends on Enter (Shift+Enter for a new line), and holds attachments, a model picker and voice input.",
    examples: [
      { title: "Default", layout: "block", html: composer() },
      { title: "With attachments", layout: "block", html: composer(`<div class="chat-attachments"><div class="chat-attachment"><span class="thumb">${i("file-text")}</span><div><b>Q4-pricing.pdf</b><span>PDF · 2.4 MB</span></div><button class="btn btn-ghost btn-sm icon-btn x" aria-label="Remove">${i("x", "icon-sm")}</button></div></div>`) },
      { title: "Recording", layout: "block", html: `<div class="composer prompt-input" style="width:100%;max-width:640px;margin:auto;flex-direction:row;align-items:center"><span class="pulse-dot" style="background:var(--icon-danger)"></span><span class="voice-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="t-label-sm text-tertiary">0:07</span><span class="grow"></span><button class="btn btn-ghost btn-sm">Cancel</button><button class="btn btn-sm icon-btn send" aria-label="Send">${i("arrow-up")}</button></div>` },
    ],
    react: `<PromptInput onSubmit={send}><PromptInput.Textarea /><PromptInput.Toolbar>…</PromptInput.Toolbar></PromptInput>`, api: [["prompt-input textarea", "element", "Autosizes up to 200px"], [".send", "button", "Disabled until there's text"], [".hide-sm", "class", "Hidden under 420px"]], a11y: ["The textarea has a label; Enter sends, Shift+Enter adds a line."] });

  add({ slug: "prompt-suggestion", name: "Prompt Suggestion", group: "AI", figma: "Prompt Suggestion · chip · card",
    desc: "Suggested prompts shown in an empty chat or under a reply. Chips for short prompts, cards for richer starters.",
    examples: [
      { title: "Chips", layout: "block", html: `<div class="prompt-suggestions" style="justify-content:center"><button class="prompt-suggestion">${i("sparkles", "icon-sm")} Summarize this week</button><button class="prompt-suggestion">${i("trending-up", "icon-sm")} Forecast Q4 revenue</button><button class="prompt-suggestion">${i("mail", "icon-sm")} Draft a follow-up</button></div>` },
      { title: "Cards", layout: "block", html: `<div class="prompt-suggestions cards" style="max-width:640px;margin:auto"><button class="prompt-suggestion">${i("bar-chart-3")}<b>Show revenue by plan</b><small>Chart for the last 6 months</small></button><button class="prompt-suggestion">${i("users")}<b>Find at-risk accounts</b><small>Usage and invoice signals</small></button><button class="prompt-suggestion">${i("calendar")}<b>Plan next week</b><small>From your calendar and tasks</small></button></div>` },
    ],
    react: `<PromptSuggestion onClick={() => send(text)}>{text}</PromptSuggestion>`, api: [["prompt-suggestions.cards", "class", "Card layout"]], a11y: ["They're buttons; clicking one fills or sends the prompt."] });

  add({ slug: "code-block", name: "Code Block", group: "AI", figma: "Code Block · default · numbered · diff",
    desc: "Syntax-highlighted code with a filename, language tag, copy button, line numbers and highlighted or diff lines.",
    examples: [{ title: "Numbered with highlight", layout: "block", html: `<div class="code-block numbered" style="max-width:640px;margin:auto">
  <div class="code-block-head"><span class="lang">tsx</span>button.tsx<button class="btn btn-ghost btn-sm" data-copy-code>${i("copy", "icon-sm")} Copy</button></div>
<pre><span><span class="k">import</span> { <span class="f">Button</span> } <span class="k">from</span> <span class="s">"@/components/ui/button"</span>;</span>
<span></span>
<span><span class="k">export function</span> <span class="f">Save</span>() {</span>
<span class="hl">  <span class="k">return</span> &lt;<span class="f">Button</span> <span class="n">variant</span>=<span class="s">"default"</span>&gt;Save changes&lt;/<span class="f">Button</span>&gt;;</span>
<span>}</span></pre>
</div>` }, { title: "Diff", layout: "block", html: `<div class="code-block" style="max-width:640px;margin:auto"><div class="code-block-head"><span class="lang">css</span>tokens.css<button class="btn btn-ghost btn-sm" data-copy-code>${i("copy", "icon-sm")} Copy</button></div><pre><span class="del">  --brand-600: #5d4ff3;</span>
<span class="add">  --brand-600: #be4000;</span>
<span>  --bg-primary: var(--brand-600);</span></pre></div>` }],
    react: `<CodeBlock language="tsx" filename="button.tsx" highlightLines={[4]}>{code}</CodeBlock>`, api: [[".numbered", "class", "Line numbers"], ["span.hl · .add · .del", "class", "Highlighted / diff lines"], ["[data-copy-code]", "button", "Copies the code"]], a11y: ["Use a <pre> so code stays selectable and scrolls horizontally."] });

  add({ slug: "markdown", name: "Markdown", group: "AI", figma: "Markdown · prose styles",
    desc: "Prose styles for rendered Markdown in AI answers and docs: headings, lists, task lists, quotes, inline code and tables.",
    examples: [{ title: "Rendered answer", layout: "block", html: `<div class="markdown" style="margin:auto">
  <h2>Q4 renewal plan</h2>
  <p>Three accounts renew in December. Focus on <strong>Globex</strong> first — usage is down and the champion changed roles.</p>
  <ul><li>Book an exec check-in by <code>Nov 22</code></li><li>Share the new analytics add-on</li></ul>
  <ul><li class="task"><input type="checkbox" checked disabled> Pull usage report</li><li class="task"><input type="checkbox" disabled> Send renewal quote</li></ul>
  <blockquote>“Tokens and components finally say the same thing.”</blockquote>
  <table><thead><tr><th>Account</th><th>Renews</th><th>MRR</th></tr></thead><tbody><tr><td>Globex</td><td>Dec 1</td><td>$12,950</td></tr><tr><td>Initech</td><td>Dec 9</td><td>$6,120</td></tr></tbody></table>
</div>` }],
    react: `<Markdown>{answer}</Markdown>`, api: [["markdown", "class", "Wrap any HTML from a Markdown renderer"]], a11y: ["Keep heading levels in order inside answers."] });

  add({ slug: "text-shimmer", name: "Text Shimmer", group: "AI", figma: "Text Shimmer",
    desc: "A light sweep across text to show work in progress — for 'Thinking…' states and loading labels.",
    examples: [{ title: "Neutral & brand", html: `<span class="text-shimmer t-h4">Analyzing 1,284 accounts…</span>
<span class="text-shimmer brand t-h4">Generating your report</span>` }],
    react: `<TextShimmer>Thinking…</TextShimmer>`, api: [[".brand", "class", "Brand-colored sweep"]], a11y: ["Turns off with reduced motion (text stays readable)."] });

  /* ------------------------------ Feedback ------------------------------ */
  add({ slug: "trend-chip", name: "Trend Chip", group: "Feedback", figma: "Trend Chip · up · down · neutral",
    desc: "A small chip that shows a change with an arrow and a sign — green for up, red for down, grey for no change.",
    examples: [{ title: "States", html: `<span class="trend-chip">${i("trending-up")} 12.4%</span>
<span class="trend-chip" data-trend="down">${i("trending-down")} 3.1%</span>
<span class="trend-chip" data-trend="neutral">${i("minus")} 0.0%</span>
<span class="trend-chip plain">${i("arrow-up-right")} +$4,280</span>` }],
    react: `<TrendChip trend="up">12.4%</TrendChip>`, api: [["data-trend", "up (default) · down · neutral", "Color and meaning"], [".plain", "class", "No background"]], a11y: ["The arrow and sign carry the meaning, not only the color."] });

  add({ slug: "number-value", name: "Number Value", group: "Feedback", figma: "Number Value",
    desc: "Formats numbers with the browser's Intl API: currency, compact, percent and signed values, in any locale.",
    examples: [{ title: "Formats", html: `<div class="stack" style="--gap:8px">
  <span class="t-data-lg number-value" data-value="248920" data-format="currency"></span>
  <span class="t-data-lg number-value" data-value="1284000" data-format="compact"></span>
  <span class="t-data-lg number-value" data-value="18.4" data-format="percent" data-sign="1"></span>
  <span class="t-data-lg number-value" data-value="248920" data-format="currency" data-currency="EUR" data-locale="de-DE"></span>
</div>` }],
    react: `<NumberValue value={248920} format={{ style: "currency", currency: "USD" }} />`, api: [["data-value", "number", "Raw value"], ["data-format", "decimal · currency · compact · percent", "Style"], ["data-currency · data-locale · data-digits · data-sign", "attributes", "Intl options"]], a11y: ["Formatted text is real text, so screen readers read it naturally."] });

  add({ slug: "rating", name: "Rating", group: "Feedback", figma: "Rating · 3 sizes · 4 values (incl. half)",
    desc: "Star rating built on radio buttons, so it works with the keyboard and in forms. Also a read-only display with half stars.",
    examples: [{ title: "Interactive & read-only", html: `<div class="stack" style="--gap:14px">
  <div class="row"><fieldset class="rating rating-lg" style="border:0;padding:0;margin:0"><legend class="sr-only">Rate your experience</legend>${[1, 2, 3, 4, 5].map((n) => `<input type="radio" name="rate1" id="r1-${n}" value="${n}"${n === 4 ? " checked" : ""}><label for="r1-${n}" aria-label="${n} star${n > 1 ? "s" : ""}">${star}</label>`).join("")}</fieldset><span class="rating-value"></span></div>
  <div class="row"><span class="rating" data-readonly role="img" aria-label="4.5 out of 5">${[1, 2, 3, 4].map(() => `<span class="star on">${star}</span>`).join("")}<span class="star" style="--fill:50%">${star}<span class="fill">${star}</span></span></span><span class="rating-value">4.5 · 1,284 reviews</span></div>
  <span class="rating rating-sm" data-readonly>${[1, 2, 3].map(() => `<span class="star on">${star}</span>`).join("")}${[1, 2].map(() => `<span class="star">${star}</span>`).join("")}</span>
</div>` }],
    react: `<Rating value={4} onChange={setValue} size="lg" />`, api: [["rating-sm · rating-lg", "class", "Sizes"], ["data-readonly", "attribute", "Display only"], ["--fill", "CSS var", "Partial star (e.g. 50%)"]], a11y: ["Interactive rating = radio group in a fieldset with a legend.", "Read-only rating has role=img and an aria-label."] });

  add({ slug: "emoji-reaction", name: "Emoji Reaction Button", group: "Feedback", figma: "Reaction · default · selected · add",
    desc: "Emoji reactions with counts. Click to add or remove yours; the selected state uses the brand color.",
    examples: [{ title: "Reactions", html: `<div class="reactions"><button class="reaction" aria-pressed="true"><span class="emo">👍</span><span class="n">12</span></button><button class="reaction" aria-pressed="false"><span class="emo">🎉</span><span class="n">4</span></button><button class="reaction" aria-pressed="false"><span class="emo">👀</span><span class="n">2</span></button><button class="reaction add" aria-label="Add reaction">${i("smile", "icon-sm")}</button></div>` }],
    react: `<EmojiReactionButton emoji="👍" count={12} isSelected onPress={toggle} />`, api: [["aria-pressed", "boolean", "Selected by you"], [".n", "element", "Count updates on click"]], a11y: ["Give each button an aria-label like '12 thumbs-up reactions'."] });

  add({ slug: "pressable", name: "Pressable Feedback", group: "Feedback", figma: "Pressable · scale · highlight · lift",
    desc: "Adds tactile press feedback to anything clickable: scale on press, a highlight, or lift on hover.",
    examples: [{ title: "Three styles", html: `<div class="card card-body pressable" tabindex="0" style="width:180px;text-align:center"><b class="t-label-md">Scale</b><div class="t-body-xs text-tertiary">Press me</div></div>
<div class="card card-body pressable" data-feedback="highlight" tabindex="0" style="width:180px;text-align:center"><b class="t-label-md">Highlight</b><div class="t-body-xs text-tertiary">Press me</div></div>
<div class="card card-body pressable" data-feedback="lift" tabindex="0" style="width:180px;text-align:center"><b class="t-label-md">Lift</b><div class="t-body-xs text-tertiary">Hover me</div></div>` }],
    react: `<PressableFeedback feedback="scale"><Card>…</Card></PressableFeedback>`, api: [["pressable", "class", "Scale to --press-scale on press"], ["data-feedback", "highlight · lift", "Alternative styles"]], a11y: ["Pressable things must be focusable and have a role (button/link)."] });

  /* ------------------------------ Layout ------------------------------ */
  add({ slug: "resizable", name: "Resizable", group: "Layout", figma: "Resizable · horizontal · vertical",
    desc: "Panels separated by a drag handle. Drag with a mouse or touch, or focus the handle and use the arrow keys.",
    examples: [{ title: "Horizontal + vertical", layout: "block", html: `<div class="resizable" style="height:280px">
  <div class="resizable-panel" style="flex:1 1 0"><b class="t-label-md">Sidebar</b><p class="t-body-sm text-tertiary">Drag the handle →</p></div>
  <div class="resizable-handle" role="separator" aria-orientation="vertical" tabindex="0" aria-valuenow="33" aria-label="Resize"></div>
  <div class="resizable" data-direction="vertical" style="flex:2 1 0;border:0;border-radius:0;min-height:0">
    <div class="resizable-panel" style="flex:2 1 0"><b class="t-label-md">Editor</b></div>
    <div class="resizable-handle" role="separator" aria-orientation="horizontal" tabindex="0" aria-label="Resize"></div>
    <div class="resizable-panel" style="flex:1 1 0"><b class="t-label-md">Terminal</b></div>
  </div>
</div>` }],
    react: `<ResizablePanelGroup direction="horizontal"><ResizablePanel /><ResizableHandle withHandle /><ResizablePanel /></ResizablePanelGroup>`, api: [["data-direction", "horizontal · vertical", "Layout"], ["data-min", "px", "Minimum panel size (default 80)"]], a11y: ["Handles are role=separator, focusable, with arrow-key resizing."] });

  /* ------------------------------ Forms ------------------------------ */
  const cellIcon = (ic, tone) => `<span class="cell-icon" style="--tone:${tone}">${i(ic)}</span>`;
  add({ slug: "cell-switch", name: "Cell Switch", group: "Forms", figma: "Cell / Switch",
    desc: "A settings row with a label, description and a switch on the right. The whole row is clickable.",
    examples: [{ title: "Settings group", layout: "block", html: `<div class="cell-group" style="max-width:440px;margin:auto">
  <div class="cell-group-label">Privacy</div>
  <label class="cell">${cellIcon("eye", "var(--blue-600)")}<span class="cell-label">Show activity status<small>Let teammates see when you're online</small></span><span class="switch"><input type="checkbox" role="switch" checked></span></label>
  <label class="cell">${cellIcon("mail", "var(--ember-600)")}<span class="cell-label">Read receipts</span><span class="switch"><input type="checkbox" role="switch"></span></label>
  <label class="cell">${cellIcon("shield-check", "var(--green-600)")}<span class="cell-label">Private mode<small>Hide your profile from search</small></span><span class="switch"><input type="checkbox" role="switch"></span></label>
</div>` }],
    react: `<CellSwitch label="Read receipts" description="…" isSelected={on} onChange={setOn} />`, api: [["label.cell", "element", "Whole row toggles the switch"], ["cell-icon --tone", "CSS var", "Icon tile color"]], a11y: ["The label element connects text and switch for screen readers."] });

  add({ slug: "cell-select", name: "Cell Select", group: "Forms", figma: "Cell / Select",
    desc: "A settings row with a compact, right-aligned native select.",
    examples: [{ title: "Preferences", layout: "block", html: `<div class="cell-group" style="max-width:440px;margin:auto">
  <div class="cell">${cellIcon("globe", "var(--lagoon-600)")}<span class="cell-label">Language</span><select class="cell-select" aria-label="Language"><option>English (US)</option><option>Deutsch</option><option>Français</option></select></div>
  <div class="cell">${cellIcon("clock", "var(--amber-500)")}<span class="cell-label">Time zone</span><select class="cell-select" aria-label="Time zone"><option>Pacific (GMT−8)</option><option>Eastern (GMT−5)</option><option>Berlin (GMT+1)</option></select></div>
  <div class="cell">${cellIcon("calendar", "var(--rose-600)")}<span class="cell-label">Week starts on</span><select class="cell-select" aria-label="Week starts on"><option>Monday</option><option>Sunday</option></select></div>
</div>` }],
    react: `<CellSelect label="Language" items={langs} selectedKey={lang} />`, api: [["cell-select", "class", "Borderless select with chevrons"]], a11y: ["Each select has an aria-label matching the row label."] });

  add({ slug: "cell-slider", name: "Cell Slider", group: "Forms", figma: "Cell · Slider · Slider Secondary",
    desc: "A settings row with a label, live value and a full-width slider.",
    examples: [{ title: "Slider group", layout: "block", html: `<div class="cell-group" data-variant="secondary" style="max-width:440px;margin:auto">
  <div class="cell cell-slider"><div class="cell-top"><span class="cell-label">Volume</span><output>60%</output></div><input class="slider" type="range" min="0" max="100" value="60" data-suffix="%" aria-label="Volume"></div>
  <div class="cell cell-slider"><div class="cell-top"><span class="cell-label">Monthly budget</span><output>$1,200</output></div><input class="slider" type="range" min="0" max="5000" step="100" value="1200" data-prefix="$" aria-label="Monthly budget"></div>
  <div class="cell cell-slider"><div class="cell-top"><span class="cell-label">Seats</span><output>24</output></div><input class="slider" type="range" min="1" max="100" value="24" aria-label="Seats"></div>
</div>` }],
    react: `<CellSlider label="Volume" defaultValue={60} formatOptions={{ style: "percent" }} />`, api: [["data-prefix · data-suffix", "attribute", "Format the output"], ["cell-group[data-variant=secondary]", "attribute", "Muted group surface"]], a11y: ["The output shows the current value as text."] });

  add({ slug: "cell-color-picker", name: "Cell Color Picker", group: "Forms", figma: "Cell / Color Picker",
    desc: "A settings row with preset swatches and a custom color input.",
    examples: [{ title: "Accent color", layout: "block", html: `<div class="cell-group" style="max-width:480px;margin:auto">
  <div class="cell"><span class="cell-label">Accent color<small class="cell-value">Iris</small></span><div class="cell-swatches">
    <button style="--sw:#5d4ff3" aria-label="Iris" aria-pressed="true"></button><button style="--sw:#be4000" aria-label="Ember" aria-pressed="false"></button><button style="--sw:#00817c" aria-label="Lagoon" aria-pressed="false"></button><button class="hide-sm" style="--sw:#c02b6c" aria-label="Rose" aria-pressed="false"></button><button class="hide-sm" style="--sw:#0072c5" aria-label="Cobalt" aria-pressed="false"></button>
    <input type="color" value="#5d4ff3" aria-label="Custom color"></div></div>
</div>` }],
    react: `<CellColorPicker label="Accent color" swatches={presets} value={color} onChange={setColor} />`, api: [["cell-swatches button[aria-pressed]", "attribute", "Selected swatch"], ["input[type=color]", "element", "Custom color"]], a11y: ["Swatches are buttons with color names as labels."] });

  add({ slug: "checkbox-button-group", name: "Checkbox Button Group", group: "Forms", figma: "Checkbox Button Group · list · grid",
    desc: "Large, card-style checkboxes for choosing several options — with icons, descriptions and a grid layout.",
    examples: [{ title: "Grid", layout: "block", html: `<fieldset class="choice-group" data-layout="grid" style="border:0;padding:0;margin:0;width:100%">
  <legend class="label" style="margin-bottom:8px">Integrations</legend>
  <label class="choice"><input type="checkbox" checked><span class="choice-body"><b>Slack</b><span>Alerts in your channels</span></span><span class="choice-icon">${i("message-square")}</span></label>
  <label class="choice"><input type="checkbox"><span class="choice-body"><b>GitHub</b><span>Link pull requests</span></span><span class="choice-icon">${i("git-branch")}</span></label>
  <label class="choice"><input type="checkbox" checked><span class="choice-body"><b>Postgres</b><span>Sync your warehouse</span></span><span class="choice-icon">${i("database")}</span></label>
  <label class="choice"><input type="checkbox" disabled><span class="choice-body"><b>Salesforce</b><span>Scale plan only</span></span><span class="choice-icon">${i("cloud")}</span></label>
</fieldset>` }],
    react: `<CheckboxButtonGroup label="Integrations" value={picked} onChange={setPicked}>…</CheckboxButtonGroup>`, api: [["choice-group[data-layout=grid]", "attribute", "Responsive grid"], ["--cols", "CSS var", "Fixed column count"]], a11y: ["Group in a fieldset with a legend; the native input stays focusable."] });

  add({ slug: "radio-button-group", name: "Radio Button Group", group: "Forms", figma: "Radio Button Group · cards · buttons",
    desc: "Card-style radios for picking one option, such as a plan — and a compact button style for short options.",
    examples: [
      { title: "Plans", layout: "block", html: `<fieldset class="choice-group" style="border:0;padding:0;margin:0;max-width:480px;margin-inline:auto"><legend class="label" style="margin-bottom:8px">Plan</legend>
  <label class="choice"><input type="radio" name="plan"><span class="choice-body"><b>Starter</b><span>Up to 5 projects</span></span><span class="price">$0</span></label>
  <label class="choice"><input type="radio" name="plan" checked><span class="choice-body"><b>Growth <span class="badge badge-accent" style="display:inline-flex;margin-left:4px">Popular</span></b><span>Unlimited projects and AI copilot</span></span><span class="price">$24</span></label>
  <label class="choice"><input type="radio" name="plan"><span class="choice-body"><b>Scale</b><span>SSO, SCIM and audit logs</span></span><span class="price">$48</span></label>
</fieldset>` },
      { title: "Buttons", html: `<fieldset class="choice-group" data-style="buttons" style="border:0;padding:0;margin:0;width:340px"><legend class="label" style="margin-bottom:8px">Size</legend>${["XS", "S", "M", "L", "XL"].map((s) => `<label class="choice"><input type="radio" name="size"${s === "M" ? " checked" : ""}><b>${s}</b></label>`).join("")}</fieldset>` },
    ],
    react: `<RadioButtonGroup label="Plan" value={plan} onChange={setPlan}>…</RadioButtonGroup>`, api: [["data-style=buttons", "attribute", "Compact button radios"]], a11y: ["Arrow keys move between radios (native behaviour)."] });

  add({ slug: "inline-select", name: "Inline Select", group: "Forms", figma: "Inline Select",
    desc: "A select that sits inside a sentence — for filters and natural-language settings.",
    examples: [{ title: "In a sentence", layout: "block", html: `<p class="t-body-lg" style="text-align:center">Show <span class="inline-select"><select aria-label="Metric"><option>revenue</option><option>signups</option><option>churn</option></select></span> for <span class="inline-select"><select aria-label="Range"><option>the last 30 days</option><option>this quarter</option><option>this year</option></select></span> grouped by <span class="inline-select"><select aria-label="Group"><option>plan</option><option>region</option></select></span>.</p>` }],
    react: `<InlineSelect items={metrics} selectedKey={metric} aria-label="Metric" />`, api: [["inline-select select", "element", "Native select styled as text"]], a11y: ["Each select needs an aria-label because the sentence isn't its label."] });

  add({ slug: "native-select", name: "Native Select", group: "Forms", figma: "Native Select · 3 sizes · default · disabled · invalid",
    desc: "The browser's own select, styled to match Facet inputs. Best on mobile, where it opens the system picker.",
    examples: [{ title: "Sizes & states", layout: "block", html: `<div class="stack" style="--gap:12px;max-width:320px;margin:auto">
  <div class="field"><label class="label" for="ns1">Country</label><select class="select" id="ns1"><option>United States</option><option>Canada</option><option>Germany</option></select></div>
  <select class="select select-sm" aria-label="Small"><option>Small</option></select>
  <select class="select select-lg" aria-label="Large"><option>Large</option></select>
  <div class="field" data-invalid="true"><label class="label" for="ns2">Role</label><select class="select" id="ns2" aria-invalid="true"><option>Choose a role…</option></select><span class="help">Pick a role to continue.</span></div>
  <select class="select" disabled aria-label="Disabled"><option>Disabled</option></select>
</div>` }],
    react: `<NativeSelect>…</NativeSelect>`, api: [["select · select-sm · select-lg", "class", "Sizes"], ["aria-invalid", "attribute", "Error state"]], a11y: ["Native selects get the platform's accessible picker for free."] });

  add({ slug: "number-stepper", name: "Number Stepper", group: "Forms", figma: "Number Stepper · 2 sizes · default · pill · ghost",
    desc: "A number input with − and + buttons, min/max/step, and buttons that disable at the limits.",
    examples: [{ title: "Variants", html: `<div class="number-stepper"><button data-step="down" aria-label="Decrease">${i("minus")}</button><input type="number" value="3" min="1" max="10" aria-label="Seats"><button data-step="up" aria-label="Increase">${i("plus")}</button></div>
<div class="number-stepper pill"><button data-step="down" aria-label="Decrease">${i("minus")}</button><input type="number" value="1" min="1" max="99" aria-label="Quantity"><button data-step="up" aria-label="Increase">${i("plus")}</button></div>
<div class="number-stepper sm ghost"><button data-step="down" aria-label="Decrease">${i("minus", "icon-sm")}</button><input type="number" value="0.5" min="0" max="2" step="0.25" aria-label="Rate"><button data-step="up" aria-label="Increase">${i("plus", "icon-sm")}</button></div>` }],
    react: `<NumberStepper minValue={1} maxValue={10} defaultValue={3} />`, api: [["min · max · step", "input attributes", "Limits and increment"], [".pill · .sm · .ghost", "class", "Variants"]], a11y: ["It's a real number input, so typing and the keyboard arrows work."] });

  add({ slug: "rich-text-editor", name: "Rich Text Editor", group: "Forms", figma: "Rich Text Editor · toolbar · bubble",
    desc: "A lightweight editor with a toolbar, a floating bubble on selection and a word count. Swap in Tiptap or Lexical for production.",
    examples: [{ title: "Editor", layout: "block", html: `<div class="rte" style="max-width:640px;margin:auto;position:relative">
  <div class="rte-toolbar">
    <select aria-label="Block style"><option value="p">Paragraph</option><option value="h2">Heading</option><option value="blockquote">Quote</option></select><span class="sep"></span>
    <button class="btn btn-ghost btn-sm icon-btn" data-cmd="bold" aria-label="Bold">${i("bold")}</button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="italic" aria-label="Italic">${i("italic")}</button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="underline" aria-label="Underline">${i("underline")}</button><button class="btn btn-ghost btn-sm icon-btn hide-sm" data-cmd="strikeThrough" aria-label="Strikethrough">${i("strikethrough")}</button><span class="sep"></span>
    <button class="btn btn-ghost btn-sm icon-btn" data-cmd="insertUnorderedList" aria-label="Bulleted list">${i("list")}</button><button class="btn btn-ghost btn-sm icon-btn hide-sm" data-cmd="insertOrderedList" aria-label="Numbered list">${i("list-ordered")}</button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="link" aria-label="Link">${i("link")}</button>
    <span class="grow"></span><button class="btn btn-ghost btn-sm icon-btn hide-sm" data-cmd="undo" aria-label="Undo">${i("undo-2")}</button><button class="btn btn-ghost btn-sm icon-btn hide-sm" data-cmd="redo" aria-label="Redo">${i("redo-2")}</button>
  </div>
  <div class="rte-content" contenteditable="true" data-placeholder="Write something…" aria-label="Editor"><h2>Launch notes</h2><p>Facet v1.2 adds <b>50+ components</b>, style themes and AI agent examples. Select some text to see the bubble menu.</p><ul><li>New charts</li><li>AI chat primitives</li></ul></div>
  <div class="rte-bubble"><button class="btn btn-ghost btn-sm icon-btn" data-cmd="bold" aria-label="Bold">${i("bold", "icon-sm")}</button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="italic" aria-label="Italic">${i("italic", "icon-sm")}</button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="link" aria-label="Link">${i("link", "icon-sm")}</button></div>
  <div class="rte-foot"><span class="rte-count">0 words</span><span>Saved</span></div>
</div>` }],
    react: `<RichTextEditor defaultValue={doc} toolbar={["bold","italic","list","link"]} />`, api: [["[data-cmd]", "bold · italic · underline · strikeThrough · insertUnorderedList · insertOrderedList · link · undo · redo", "Toolbar commands"], ["rte-bubble", "class", "Floating menu on selection"]], a11y: ["The editable area has a label; toolbar buttons expose aria-pressed."] });

  /* ------------------------------ Navigation ------------------------------ */
  add({ slug: "segment", name: "Segment", group: "Navigation", figma: "Segment · 3 sizes · default · primary · icon",
    desc: "A segmented control for switching views or values. The thumb slides between options; arrow keys move the selection.",
    examples: [{ title: "Variants", layout: "block", html: `<div class="stack" style="--gap:14px;align-items:center">
  <div class="segment" role="radiogroup" aria-label="Range"><button role="radio" aria-checked="false">Day</button><button role="radio" aria-checked="true">Week</button><button role="radio" aria-checked="false">Month</button><button role="radio" aria-checked="false">Year</button></div>
  <div class="segment icon-only" role="radiogroup" aria-label="View"><button role="radio" aria-checked="true" aria-label="List">${i("list")}</button><button role="radio" aria-checked="false" aria-label="Grid">${i("layout-grid")}</button><button role="radio" aria-checked="false" aria-label="Map">${i("map")}</button></div>
  <div class="segment primary sm" role="radiogroup" aria-label="Billing"><button role="radio" aria-checked="true">Monthly</button><button role="radio" aria-checked="false">Yearly · save 20%</button></div>
  <div class="segment block lg" role="radiogroup" aria-label="Theme" style="width:100%;max-width:360px"><button role="radio" aria-checked="false">${i("sun", "icon-sm")} Light</button><button role="radio" aria-checked="true">${i("moon", "icon-sm")} Dark</button><button role="radio" aria-checked="false">${i("monitor", "icon-sm")} Auto</button></div>
</div>` }],
    react: `<Segment selectedKey={range} onSelectionChange={setRange}><Segment.Item id="week">Week</Segment.Item></Segment>`, api: [["role=radio aria-checked", "attribute", "Selected option"], [".sm · .lg · .block · .icon-only · .primary", "class", "Variants"], ["facet:change", "event", "Fires with {value}"]], a11y: ["Radiogroup semantics with roving tabindex and arrow keys."] });

  add({ slug: "navbar", name: "Navbar", group: "Navigation", figma: "Navbar · desktop · mobile open",
    desc: "A sticky, blurred top bar with brand, links and actions. Under 720px the links collapse into a menu button.",
    examples: [{ title: "Responsive", layout: "block", html: `<header class="navbar" style="width:100%;border:1px solid var(--border-default);border-radius:14px 5px 14px 14px">
  <div class="navbar-inner">
    <a class="navbar-brand" href="#"><span class="logo">F</span>Facet</a>
    <nav class="navbar-links"><a href="#" aria-current="page">Product</a><a href="#">Components</a><a href="#">Pricing</a><a href="#">Docs</a></nav>
    <div class="navbar-actions"><a class="btn btn-ghost btn-sm hide-sm" href="#">Sign in</a><a class="btn btn-sm" href="#">Get started</a><button class="btn btn-ghost btn-sm icon-btn navbar-toggle" aria-label="Menu" aria-expanded="false">${i("menu")}</button></div>
  </div>
  <nav class="navbar-mobile"><a href="#">Product</a><a href="#">Components</a><a href="#">Pricing</a><a href="#">Docs</a><a class="btn btn-outline btn-block" href="#">Sign in</a></nav>
</header>` }],
    react: `<Navbar><Navbar.Brand /><Navbar.Content>…</Navbar.Content><Navbar.MenuToggle /><Navbar.Menu>…</Navbar.Menu></Navbar>`, api: [["navbar[data-open]", "attribute", "Mobile menu open"], ["navbar-toggle", "button", "Shown under 720px"]], a11y: ["The menu button has aria-expanded; the mobile menu is a nav landmark."] });

  add({ slug: "app-layout", name: "App Layout", group: "Navigation", figma: "App Layout · sidebar · inset · aside",
    desc: "A full app shell: sidebar, sticky navbar, main area and an optional right aside. The sidebar collapses to icons (⌘B); on phones it becomes a sheet and the aside becomes an overlay.",
    examples: [{ title: "Inset with aside — try the Mobile toggle", layout: "block", html: `<div class="app-layout" data-variant="inset" data-aside="auto" style="width:100%;height:560px">
  <nav class="sidebar" aria-label="Main">
    <div class="workspace"><span class="logo">A</span><b class="t-label-md grow label-text">Acme Inc.</b></div>
    <div class="sidebar-label">Workspace</div>
    <a class="sidebar-item" href="#" aria-current="page">${i("layout-dashboard")}<span class="label-text">Dashboard</span></a>
    <a class="sidebar-item" href="#">${i("inbox")}<span class="label-text">Inbox</span><span class="count">8</span></a>
    <a class="sidebar-item" href="#">${i("users")}<span class="label-text">Customers</span></a>
    <a class="sidebar-item" href="#">${i("bar-chart-3")}<span class="label-text">Reports</span></a>
  </nav>
  <div class="app-body">
    <header class="app-navbar">
      <button class="btn btn-ghost btn-sm icon-btn app-menu-toggle" data-app-toggle="mobile" aria-label="Open menu">${i("menu")}</button>
      <button class="btn btn-ghost btn-sm icon-btn app-desk-only" data-app-toggle="sidebar" aria-label="Collapse sidebar">${i("panel-left")}</button>
      <ol class="breadcrumb"><li><a href="#">Acme</a></li><li>${i("chevron-right")}</li><li aria-current="page">Dashboard</li></ol>
      <span class="grow"></span>
      <button class="btn btn-ghost btn-sm icon-btn" aria-label="Search">${i("search")}</button>
      <button class="btn btn-sm" data-app-toggle="aside">${i("sparkles", "icon-sm")} <span class="label-text">Ask AI</span></button>
    </header>
    <main class="app-main">
      <div class="kpi-group"><div class="kpi"><span class="kpi-label">MRR</span><span class="kpi-value">$248.9k</span></div><div class="kpi"><span class="kpi-label">Customers</span><span class="kpi-value">1,284</span></div><div class="kpi"><span class="kpi-label">Churn</span><span class="kpi-value">2.4%</span></div></div>
      <div class="card card-body" style="min-height:160px"><b class="t-label-md">Content</b><p class="t-body-sm text-tertiary">Main column scrolls; navbar stays on top.</p></div>
    </main>
  </div>
  <aside class="app-aside"><div class="app-aside-head">${i("sparkles", "icon-sm")} Facet AI<span class="grow"></span><button class="btn btn-ghost btn-sm icon-btn" data-app-toggle="aside" aria-label="Close">${i("x")}</button></div><div style="padding:16px" class="stack"><div class="chat-msg">${ai}<div class="chat-msg-body"><div class="chat-msg-text t-body-sm">Ask me about this dashboard.</div></div></div><div class="prompt-suggestions"><button class="prompt-suggestion">Why did churn rise?</button></div></div></aside>
  <div class="app-scrim"></div>
</div>` }],
    react: `<AppLayout sidebar={<Sidebar />} navbar={<Navbar />} aside={<Assistant />} sidebarVariant="inset">{children}</AppLayout>`,
    api: [["data-variant", "inset", "Inset card body"], ["data-sidebar", "collapsed", "Icon rail"], ["data-aside", "auto · open · closed", "Right panel (auto = open on desktop, hidden below 1024px)"], ["data-app-toggle", "sidebar · mobile · aside", "Toggle buttons"], ["⌘B / Ctrl+B", "shortcut", "Collapse the sidebar (full-page layouts)"]],
    a11y: ["Landmarks: nav (sidebar), header, main, aside.", "On phones the sidebar opens as a sheet with a scrim; tap the scrim to close."] });

  add({ slug: "context-menu", name: "Context Menu", group: "Overlays", figma: "Context Menu · items · checkable · submenu",
    desc: "A menu that opens on right-click (or long-press on touch) at the cursor, with shortcuts, checkable items and a danger action.",
    examples: [{ title: "Right-click the area", layout: "block", html: `<div class="context-area" data-context-menu="ctx-demo" style="max-width:520px;margin:auto">${i("mouse-pointer-click")}<div>Right-click here (or long-press on a phone)</div></div>
<div class="menu context-menu" id="ctx-demo" role="menu">
  <button class="menu-item" role="menuitem">${i("copy")} Copy<span class="shortcut">⌘C</span></button>
  <button class="menu-item" role="menuitem">${i("pencil")} Rename<span class="shortcut">F2</span></button>
  <button class="menu-item" role="menuitem">${i("share-2")} Share…</button>
  <div class="menu-sep"></div>
  <button class="menu-item" role="menuitemcheckbox" aria-checked="true">${i("check", "check-mark")} Show grid</button>
  <button class="menu-item" role="menuitemcheckbox" aria-checked="false">${i("check", "check-mark")} Snap to pixels</button>
  <div class="menu-sep"></div>
  <button class="menu-item danger" role="menuitem">${i("trash-2")} Delete<span class="shortcut">⌫</span></button>
</div>` }],
    react: `<ContextMenu><ContextMenu.Trigger>…</ContextMenu.Trigger><ContextMenu.Content>…</ContextMenu.Content></ContextMenu>`, api: [["data-context-menu", "menu id", "Element that opens the menu"], ["role=menuitemcheckbox aria-checked", "attribute", "Checkable item"]], a11y: ["Opens with the context-menu key too; Escape closes.", "Offer the same actions somewhere visible — not everyone right-clicks."] });

  add({ slug: "emoji-picker", name: "Emoji Picker", group: "Overlays", figma: "Emoji Picker",
    desc: "Search, categories, skin tones and a live preview. Fires facet:emoji with the chosen emoji; data-target inserts it into an input.",
    examples: [{ title: "Picker", html: `<div class="stack" style="--gap:10px;align-items:center"><div class="emoji-picker" data-target="ep-out"></div><input class="input" id="ep-out" placeholder="Picked emoji appear here" style="width:320px"></div>` }],
    react: `<EmojiPicker onSelect={(e) => insert(e.emoji)} />`, api: [["data-target", "element id", "Insert into this input"], ["facet:emoji", "event", "{emoji, name}"]], a11y: ["Every emoji is a button with its name as the label; search filters by name."] });

  add({ slug: "sheet-pro", name: "Sheet (sides & parts)", group: "Overlays", figma: "Sheet · right · left · bottom",
    desc: "Side panels with a header, scrolling body and footer. Use left for navigation, right for details and forms, bottom (drawer) on mobile.",
    examples: [{ title: "Right sheet (inline demo)", layout: "block", html: `<div class="inline-sheet"><div class="overlay sheet-overlay"><div class="sheet" role="dialog" aria-label="Edit deal">
  <div class="sheet-head"><b class="t-h5 grow">Edit deal</b><button class="btn btn-ghost btn-sm icon-btn" aria-label="Close">${i("x")}</button></div>
  <div class="sheet-body"><div class="field"><label class="label" for="sh1">Name</label><input class="input" id="sh1" value="Northwind renewal"></div><div class="field"><label class="label" for="sh2">Amount</label><input class="input" id="sh2" value="$12,400"></div><div class="field"><label class="label" for="sh3">Stage</label><select class="select" id="sh3"><option>Negotiation</option></select></div></div>
  <div class="sheet-foot"><button class="btn btn-outline">Cancel</button><button class="btn">Save</button></div>
</div></div></div>` }],
    react: `<Sheet side="right"><Sheet.Header>…</Sheet.Header><Sheet.Body>…</Sheet.Body><Sheet.Footer>…</Sheet.Footer></Sheet>`, api: [["sheet-overlay · sheet-left", "class", "Right (default) or left"], ["sheet-head · sheet-body · sheet-foot", "class", "Parts"]], a11y: ["Trap focus inside and return it to the trigger on close."] });
})();
