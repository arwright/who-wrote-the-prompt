// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
// Who Wrote the Prompt: assets/song.wav, 112 bpm (confirmed: chorus 1 to the final chorus is 52 bars at 112.00 within
// 34 ms), first bar line at 0.811 s (the vocal pickup "They" at 0.40 s sits on the "and" before it). Bar = 2.1429 s.
const PROJECT = { duration: 169.04, bpm: 112, offset: 0.811, audio: 'assets/song.wav' };
