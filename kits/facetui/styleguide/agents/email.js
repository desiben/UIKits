/* Email — agent example */
(function () {
  window.APP = {
    brand: "iris", name: "Inbox", short: "your inbox", icon: "mail", page: "Primary", org: "maya@northwind.io",
    nav: [{ items: [["inbox", "Inbox", "12", 1], ["star", "Starred"], ["send", "Sent"], ["file-text", "Drafts", "2"], ["archive", "Archive"]] }, { label: "Labels", items: [["tag", "Customers"], ["tag", "Finance"], ["tag", "Newsletters", "14"]] }],
    state: {
      mail: [
        ["MC", "Maya Chen", "Q4 pricing proposal — final numbers", "Hi! Attached are the final numbers for the Q4 pricing proposal. Can we review before Friday?", "9:41", 1, "av-1"],
        ["JR", "Jonas Richter", "Re: Security review for Globex", "Their team needs the SOC 2 report and pen test summary by Monday.", "9:12", 1, "av-3"],
        ["AW", "AWS Billing", "Your invoice INV-88213 is available", "Amount due: $18,760.00. Due date: Oct 24, 2026.", "8:30", 0, "av-2"],
        ["PD", "Product Digest", "This week in design systems", "Tokens, motion and the rise of AI-native components…", "Yesterday", 0, "av-5", 1],
        ["SL", "Stack Letter", "5 tools we loved in October", "A roundup of our favorite dev tools this month…", "Yesterday", 0, "av-4", 1],
        ["AK", "Aiko Kato", "Design sync notes", "Notes from today's sync and next steps for onboarding v2.", "Mon", 0, "av-4"],
      ],
      sel: 0,
    },
    render(s, i) {
      const m = s.mail[s.sel] || s.mail[0];
      return `<div class="surface-head"><div><h1>Inbox</h1><p>${s.mail.filter((x) => x[5]).length} unread · ${s.mail.length} conversations</p></div><div class="row"><button class="btn btn-sm">${i("square-pen", "icon-sm")} Compose</button></div></div>
      <div class="g2" style="align-items:start">
        <div class="list-view"><div class="list-view-head"><div class="segment sm" role="radiogroup" aria-label="Filter"><button role="radio" aria-checked="true">All</button><button role="radio" aria-checked="false">Unread</button></div><span class="grow"></span><button class="btn btn-ghost btn-sm" onclick="APP_RUN(3)">${i("sparkles", "icon-sm")} Clean up</button></div>
          ${s.mail.map(([a, n, sub, prev, t, un, av], k) => `<div class="list-row ${s.fresh && s.fresh.includes(n) ? "hl-new" : ""}" data-interactive ${k === s.sel ? 'aria-selected="true"' : ""} onclick="APP.state.sel=${k};APP_REPAINT()"><span class="avatar av-${av ? av.slice(-1) : 1}">${a}</span><div class="list-main"><b style="${un ? "" : "font-weight:500"}">${n}${un ? ' <span class="badge badge-brand" style="display:inline-flex;height:18px;margin-left:4px">New</span>' : ""}</b><span>${sub}</span></div><span class="list-meta">${t}</span></div>`).join("")}
        </div>
        <div class="card"><div class="card-header"><span class="avatar av-${m[6].slice(-1)}">${m[0]}</span><div class="grow"><div class="card-title">${m[2]}</div><div class="card-desc">${m[1]} · ${m[4]}</div></div><button class="btn btn-ghost btn-sm icon-btn" aria-label="Archive">${i("archive")}</button></div><div class="card-body"><p class="t-body-md">${m[3]}</p><p class="t-body-md text-secondary" style="margin-top:12px">Thanks,<br>${m[1].split(" ")[0]}</p></div><div class="card-footer" style="justify-content:flex-start"><button class="btn btn-outline btn-sm">${i("reply", "icon-sm")} Reply</button><button class="btn btn-ghost btn-sm" onclick="APP_RUN(1)">${i("sparkles", "icon-sm")} Draft with AI</button></div></div>
      </div>`;
    },
    agent: {
      name: "Mail assistant", greeting: "What do you want to get through?", sub: "I can summarize, find, draft and organize email. I always ask before sending.",
      prompts: [
        { label: "Summarize unread", hint: "2 need a reply", icon: "inbox", keys: ["summar", "unread", "catch"],
          steps: [["Reading 2 unread threads", ""], ["Checking for deadlines", "Found 2"]],
          text: "<p>Two emails need you today:</p><ul><li><strong>Maya Chen</strong> wants to review Q4 pricing <strong>before Friday</strong>.</li><li><strong>Jonas Richter</strong> needs the SOC 2 report and pen-test summary for Globex <strong>by Monday</strong>.</li></ul><p>Everything else is FYI or newsletters.</p>" },
        { label: "Draft a reply to Maya", hint: "Suggest Thursday 2pm", icon: "reply", keys: ["draft", "reply", "maya", "respond", "write"],
          steps: [["Reading the thread", "Q4 pricing proposal"], ["Checking your calendar", "Free Thu 2–3pm"]],
          text: "<p>Here's a draft — edit anything before I send it:</p>",
          ui: () => `<div class="rte" style="position:relative"><div class="rte-toolbar"><button class="btn btn-ghost btn-sm icon-btn" data-cmd="bold" aria-label="Bold"><svg class="icon"><use href="#bold"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="italic" aria-label="Italic"><svg class="icon"><use href="#italic"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="insertUnorderedList" aria-label="List"><svg class="icon"><use href="#list"/></svg></button><span class="grow"></span><span class="t-caption text-tertiary" style="padding-right:6px">To: maya@northwind.io</span></div><div class="rte-content" contenteditable="true" style="min-height:120px;font:var(--text-body-sm)"><p>Hi Maya,</p><p>Thanks for sending these over. Does <b>Thursday at 2pm</b> work to walk through them? I'll send an invite.</p><p>Best,<br>Maya R.</p></div></div>`,
          approval: { tool: "mail.send", icon: "send", cta: "Send", summary: "Send <b>“Re: Q4 pricing proposal”</b> to <b>maya@northwind.io</b>?", done: "Email sent", doneSub: "To Maya Chen", after: "Sent, and I added a placeholder on your calendar for Thursday 2pm.", onApprove(s) { s.mail[0][5] = 0; } } },
        { label: "Find invoices from AWS", hint: "Last 90 days", icon: "receipt", keys: ["find", "invoice", "aws", "search", "bill"],
          steps: [["Searching mail", "from:aws subject:invoice"]],
          tool: { name: "mail.search", icon: "search", args: '{ <span class="k">"q"</span>: "from:aws invoice", <span class="k">"after"</span>: "2026-07-18" }', result: "3 results" },
          text: "<p>I found three AWS invoices:</p>",
          ui: () => `<div class="item-card-group joined"><div class="item-card"><span class="item-card-icon"><svg class="icon"><use href="#receipt"/></svg></span><div class="item-card-content"><span class="item-card-title">INV-88213 · $18,760.00</span><span class="item-card-desc">October · due Oct 24</span></div><span class="badge badge-warning">Open</span></div><div class="item-card"><span class="item-card-icon"><svg class="icon"><use href="#receipt"/></svg></span><div class="item-card-content"><span class="item-card-title">INV-86102 · $10,820.00</span><span class="item-card-desc">September</span></div><span class="badge badge-success">Paid</span></div><div class="item-card"><span class="item-card-icon"><svg class="icon"><use href="#receipt"/></svg></span><div class="item-card-content"><span class="item-card-title">INV-84477 · $10,410.00</span><span class="item-card-desc">August</span></div><span class="badge badge-success">Paid</span></div></div>` },
        { label: "Clean up newsletters", hint: "14 unread newsletters", icon: "archive", keys: ["clean", "newsletter", "archive", "unsubscribe", "tidy"],
          steps: [["Finding newsletters", "Label: Newsletters · 14"], ["Checking what you read", "Opened 2 of 14 last month"]],
          text: "<p>You rarely open <strong>Product Digest</strong> and <strong>Stack Letter</strong>. I can archive all 14 newsletters and keep the label for later.</p>",
          approval: { tool: "mail.archive", icon: "archive", cta: "Archive 14", summary: "Archive <b>14 newsletters</b> (Product Digest, Stack Letter and 3 others)?", done: "Archived 14 emails", doneSub: "Undo from Archive", after: "Done. Your inbox is down to the emails that matter.", onApprove(s) { s.mail = s.mail.filter((m) => !m[7]); s.sel = 0; } } },
      ],
    },
    autoplay: 1,
  };
})();
