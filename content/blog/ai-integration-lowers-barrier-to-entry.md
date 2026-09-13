---
title: "AI Integration Lowers the Barrier to Entry for Third Party Services"
date: "2026-08-04"
excerpt: "How MCP and Cursor lower the barrier to entry for huge third party tools. A story about PostHog, session replay, and analytics without a two hour tutorial."
slug: "ai-integration-lowers-barrier-to-entry"
locale: "en"
translationSlug: "ai-integracija-smanjuje-barrier-to-entry"
---

I work on the [Kosmonaut](https://www.kosmonaut.rs/) platform. Recently we were choosing analytics. We tried Vercel Analytics first, but we quickly realized it was not enough.

One of the important things for us was session replay, where you can see exactly what a user did. Literally a recording of their session on the platform.

We looked around the market a bit. There is Amplitude, Mixpanel, FullStory… but in the end we went with PostHog. It had the features we needed, plus a free tier that is enough to try things before you have a user base and a reason to pay for analytics.

---

The problem for me right away was that it is a huge product. It has, I do not know, 13 subproducts inside it. So how do you find your way around software like that? I would probably have had to watch a full two hour tutorial just to get started.

In a startup, speed is everything. Things go stale before you finish learning them, and everyone plays by *move fast and break things*. I personally did not have time to watch tutorials. And I definitely do not have the money to hire someone whose job it is to do this.

I tried a bit on my own. I gave up quickly.

---

I did a little research and realized PostHog has an MCP server, a direct integration with Cursor.

I already had a good experience with MCP servers. I use them for Google Calendar to build my schedule, for Linear to create tasks, and plenty of other examples. I thought, alright, let me try this too, maybe it will be cool.

And yes, it was.

The setup is simple: one CLI command and you are ready to go. The first thing I asked the AI: *where do I start, man, where do I begin?*

Cursor quickly explained what matters at our startup stage:

- focus on page views
- once a week, watch a few recordings of your users
- build a few custom funnels that make user behavior easier to understand
- create dashboards with custom views for all of that

Suddenly that enabled me to do anything. I said I need this, this, this, and this. The AI easily generated the views, custom funnels, and everything you need for a solid analytics starting point.

---

A classic example: we wrote a blog post for our partners. If a partner wants to join our network, that article explains how to do it. I sent it to partners and simply asked Cursor:

*tell me if anyone opened it?*

They did. *Send me the link to their session recording.*

Bam, link. I looked at exactly what they watched, which section they spent the most time on, and now I know how to improve the product. Simple. No tutorial.

A tutorial gives me no value. I already know what I need to track and what I need to look at. A tutorial only shows me the technical steps to set that up, and that is a bit of a waste of time. Especially if the product is 10 years old and has 15 subproducts, and I have never seriously used that tool.

---

If you made it this far, thank you.

Check out [Kosmonaut](https://www.kosmonaut.rs/). Write to us and tell us what you think.

And I hope this helps when you are choosing a third party service. Not so much *which* tool, but *how* to get into it without drowning in documentation.
