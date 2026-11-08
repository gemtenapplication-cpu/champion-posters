# 2026-11-08 · GTA VI hype promo for CHAMPION

`2026-11-08-gta6-hype-promo.mp4`: 54 s, 1920×1080, 30 fps, H.264 + AAC, loudness -14 LUFS (Facebook/YouTube).
`2026-11-08-gta6-hype-promo.srt`: English captions for the voice-over (upload them with the video on Facebook).

This is **version A (original visuals)**. Every frame, the music, the sound effects and the voice-over are
original. The video contains no Rockstar footage, artwork, logo or music. Grand Theft Auto VI is mentioned
only by name, with its announced release date and full credit.

Version B (with clips from the official GTA VI Trailer 1) was delivered to the owner directly. It is
deliberately **not** stored in this public repository, because it contains Rockstar's copyrighted footage.

## Voice-over script (ElevenLabs voice "David – Epic Movie Trailer")
| time | line |
|---|---|
| 0:01 | The wait... is almost over. |
| 0:05 | Vice City is calling. |
| 0:11 | Grand Theft Auto Six. |
| 0:13 | November nineteenth. On PlayStation Five. |
| 0:20 | Big games... deserve big screens. |
| 0:25 | Two PS5 stations. Fifty-five inch screens. |
| 0:30 | And a gaming PC... built to win. |
| 0:36 | Champion. Gaming Zone. Cumilla. |
| 0:41 | Opening soon. Book your slot online. |
| 0:45 | Play. Connect. Win. |

## Facebook caption
```
The wait is almost over. GTA VI lands on PS5 on 19 November.
Big games deserve big screens: 2 PS5 stations on 55" screens + a gaming PC with a 30" monitor.
CHAMPION Gaming Zone is opening soon.
📍 IFIC Bank Building (4th Floor), Ranir Bazar, Cumilla
🎮 Book online: champion.gemten.com.bd
PLAY + CONNECT + WIN
Grand Theft Auto VI is a Rockstar Games title. Not affiliated with or endorsed by Rockstar Games.
#ChampionGamingZone #Cumilla #GTA6 #PS5 #GamingZone #ComingSoon
```

## Credits shown on the end card
Grand Theft Auto VI is developed and published by Rockstar Games; release date (19 November 2026) and
platforms as announced by Rockstar Games. Grand Theft Auto, GTA and Rockstar Games are trademarks of
Take-Two Interactive Software, Inc. PlayStation and PS5 are trademarks of Sony Interactive Entertainment Inc.
CHAMPION Gaming Zone is not affiliated with, sponsored or endorsed by any of them.

## Rebuild (`gta6-hype-promo-src/`)
- `scene.html`: every scene, drawn with HTML/Canvas and the brand fonts (Orbitron + Rajdhani).
  `renderAt(t)` draws the frame at time `t`.
- `render.js`: Playwright renders frames and pipes them to ffmpeg
  (`node render.js video A 0 54 out.mp4`; `node render.js stills A dir 12.5 30`).
  It needs `npm i @fontsource/orbitron @fontsource/rajdhani` next to it.
- `mix.py`: builds the audio mix: voice-over bus, music ducked under the voice, and the sound effects.
  Then run two-pass `loudnorm` to -14 LUFS.
- `audio/`: the generated ElevenLabs assets: voice-over lines, music (with its composition plan) and sound effects.
- Final pass: film grain, vignette, 2.35:1 letterbox, fade out.
