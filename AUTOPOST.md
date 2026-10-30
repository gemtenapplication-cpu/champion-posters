# Champion daily Facebook poster — run book

Every run designs ONE new poster for The Champion's Facebook page, stores it in this repo,
and schedules it on the page through Metricool. Follow every rule below.

## Accounts
- Metricool brand (blogId): `7682593`, timezone `Asia/Dhaka`, network: Facebook only.
- Public image link pattern (after `git push`):
  `https://raw.githubusercontent.com/gemtenapplication-cpu/champion-posters/main/posters/YYYY-MM/<file>.png`
  Check it returns HTTP 200 before scheduling.

## Hard rules
1. **English only.** No Bangla text anywhere: not on the poster, not in the caption.
2. Light / day-mode design. Use the logos in `brand/` in their original colours
   (`brand/logo-color-on-light.png` is the default). Never redraw or recolour the logo.
3. No real game, console or brand logos/artwork (no PlayStation symbols, no game key art,
   no copyrighted characters). Plain words like "PS5" are fine. Draw everything else with CSS/SVG.
4. Only true facts (below). Never invent prices, offers, dates, events or prizes.
   If a fact is not listed here, leave it out.
5. One new idea every day. Read `posts-log.md` first and do not repeat a headline or angle
   used in the last 14 days.
6. Format: 1080 × 1350 px PNG (4:5). Fonts: Orbitron (display) + Rajdhani (body), installed via
   `npm i @fontsource/orbitron @fontsource/rajdhani`. Render with Playwright Chromium, then look
   at the PNG once and fix anything clipped or overlapping before posting.
7. Brand colours: blue `#2B83F6`, light blue `#4DA3FF`, deep blue `#1F6FE5`, near-black `#0B0B0C`,
   light background `#F4F8FF`.

## True facts (only these)
- Name: CHAMPION — The Champion, Gaming Zone. Tagline: PLAY + CONNECT + WIN.
- Location: IFIC Bank Building (4th Floor), Ranir Bazar, Cumilla.
- Setup: 2 PS5 stations on 55" screens, 1 gaming PC with a 30" monitor.
- Online booking: champion.gemten.com.bd
- Status: opening soon (no confirmed opening date yet).
- Not available yet (never advertise): racing/car simulator, arcade, claw machine, food/café.
- Audience: students and young gamers in Cumilla; many schools and madrasas nearby,
  so keep the tone clean and parent-friendly.

## Angle ideas (rotate; add new ones freely if they stay within the facts)
Big screens · squad up / bring friends · 1v1 rivalry · gaming PC corner · "book your slot online" ·
weekend plans · after-class break · find us (location / 4th floor) · countdown "opening soon" ·
comment prompt ("Who's your gaming partner?") · Cumilla pride · trophy / become the champion.

## Timing (Dhaka time)
Schedule the post at **10:00** on the same day (Wednesday: **12:00**). If that time has already
passed when the run starts, schedule 15 minutes from now. Facebook type `POST`, `autoPublish: true`.

## Caption
English, 3–8 short lines: hook line, one or two facts, location line `📍 IFIC Bank Building
(4th Floor), Ranir Bazar, Cumilla`, booking line `🎮 Book online: champion.gemten.com.bd`,
`PLAY + CONNECT + WIN`, then 5–7 hashtags (always `#ChampionGamingZone #Cumilla`).

## After scheduling
- Commit the PNG, its HTML source and one line in `posts-log.md`
  (`YYYY-MM-DD | headline | angle | Metricool post id`), then push to `main`.
- Report in Bangla: the headline, the scheduled time and the Metricool planner link.
