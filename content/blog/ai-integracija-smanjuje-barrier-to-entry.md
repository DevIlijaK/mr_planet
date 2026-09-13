---
title: "AI integracija smanjuje barrier to entry za third party servise"
date: "2026-08-04"
excerpt: "Kako MCP + Cursor skidaju barijeru ulaska u ogromne third party toolove. Priča o PostHog-u, session replay-u i analyticsu bez dvosatnog tutorijala."
slug: "ai-integracija-smanjuje-barrier-to-entry"
locale: "sr"
translationSlug: "ai-integration-lowers-barrier-to-entry"
---

Radim na [Kosmonaut](https://www.kosmonaut.rs/) platformi. Skoro smo birali analytics. Probali smo prvo Vercel Analytics, al' brzo smo shvatili da nam to nije dovoljno.

Jedna od bitnih stvari nam je bila session replay, gde možeš da vidiš tačno šta je korisnik radio. Bukvalno snimak njegove sesije na platformi.

Pogledali smo malo tržište. Imaš tu Amplitude, Mixpanel, FullStory… al' smo se na kraju odlučili za PostHog. Imao je feature-e koji su nam trebali, plus free tier dovoljan da probate stvari pre nego što imate bazu korisnika i smisla da plaćate analytics.

---

Ono što je meni odmah bio problem je što je to ogroman proizvod. Imaš, nemam pojma, 13 podproizvoda u njemu. I sad, kako se snaći u takvom softveru? Verovatno bih morao da odgledam ceo tutorijal od 2 sata da bih tek mogao da počnem.

U startupu je brzina sve. Stvari zastarevaju pre nego što stignete da ih naučite, i svi igramo po onom *move fast and break things*. Ja lično nisam imao vremena da gledam tutorijale. A definitivno nemam para da zaposlim osobu koja će ovo da radi.

Krenuo sam malo sam. Brzo sam odustao.

---

Uzeo sam malo da istražujem i shvatio da PostHog ima MCP server, direktnu integraciju sa Cursorom.

Imao sam već dobro iskustvo sa MCP serverima. Koristim ih za Google Calendar da mi pravi raspored, za Linear da kreira taskove, i još puno primera. Rekoh: ajde da probam i ovo, možda bude cool.

I da, bilo je.

Setup je jednostavan: jedna CLI komanda and you are ready to go. Prva stvar koju sam pitao AI: *gde da krenem čoveče, odakle da počnem?*

Cursor mi je brzo objasnio šta je u našoj fazi startupa bitno:

- fokusiraj se na preglede stranica
- pogledaj jednom nedeljno par snimaka vaših korisnika
- napravi par custom funnela koji će lakše da ti objasne kako se korisnici ponašaju
- napravi dashboard-e sa custom pregledima za sve to

Odjednom me je to enable-ovalo da uradim bilo šta. Rekao sam treba mi to, to, to i to. AI je lagano izgenerisao preglede, custom funnel-e i sve što treba za jedan solidan analytics starting point.

---

Klasičan primer: napisali smo blog za naše partnere. Ako neki partner želi da pristupi našoj mreži, na tom članku može da se informiše kako to da uradi. Poslao sam to partnerima i samo sam pitao Cursor:

*reci mi da li je neko ulazio?*

Jeste. *Pošalji mi link do snimka njihove sesije.*

Bam, link. Pogledao sam tačno šta su gledali, na kojoj sekciji su se najviše zadržali, i sada znam kako da poboljšam proizvod. Jednostavno. Bez tutorijala.

Tutorijal mi ne daje nikakav value. Ja već znam šta treba da trakujem, šta treba da gledam. Tutorijal mi samo pokazuje tehnički kako to da napravim, a to je malo gubljenje vremena. Pogotovo ako je proizvod star 10 godina i ima 15 podproizvoda, a ja nikad nisam ozbiljno koristio taj tool.

---

Ako ste stigli dovde, hvala.

Pogledajte [Kosmonaut](https://www.kosmonaut.rs/). Pišite nam kako vam se čini.

I nadam se da će vam ovo pomoći kad budete birali third party servis. Ne toliko *koji* tool, koliko *kako* da uđete u njega bez da potonete u dokumentaciju.
