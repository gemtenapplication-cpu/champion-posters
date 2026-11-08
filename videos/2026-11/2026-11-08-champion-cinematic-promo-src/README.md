# Champion — 25s cinematic promo (8 Nov 2026)

Vertical 1080×1920, 30 fps, H.264 + AAC, mixed to −14 LUFS.

- `render.py` renders the frames with Python, NumPy and Pillow. It grades the two venue walkthrough clips, cuts them to the music's beat grid (6.88 s + 0.4291 s × k) and adds the logo slams, kinetic text and end card. Fonts are Orbitron and Rajdhani from `@fontsource`.
- `mix.py` mixes the music, voice-over and SFX. The music and SFX duck under the voice, and the result is loudness-normalised.
- `audio/` holds the ElevenLabs assets:
  - Music (`music_v1`, composition plan in `music_plan_b.json`).
  - Voice-over "David – Movie Trailer Narrator" (`vo_david_v2.mp3` = "Welcome to Champion", `vo_tag.mp3` = "Play. Connect. Win.").
  - Sound effects.

The scripts still point at the scratch paths used when the video was made. Change `S`, `UP` and `BRAND` at the top of `render.py` before you re-run it.
