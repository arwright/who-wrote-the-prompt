# Who Wrote the Prompt? How this video was made

Video: https://youtu.be/OfUJ_3eF18o

The song is about the people who write the prompts, set the rewards and deploy AI systems, and how their names drop out of the story. So here are the prompts behind the song itself.

This is a curated record, not a full transcript. My own messages are quoted word for word. Claude's replies are summarized, and quoted where they shaped the result. I've left out the routine troubleshooting: download dialogs, player settings and the like.

Tools: Claude Opus 5.5 (chat, for research, lyrics and the description), Suno (vocals and music), Claude Code with Claude Fable 5.1 (animation code, using [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) by John Heibel), and my own recorded voice for the spoken outro.

— Anne Wright

---

## 1. How it started

I'd been seeing AI-made music videos about AI risk, credited to Claude. My first message:

> We're seeing a number of videos on youtube that seem like potential accelerationist propaganda, such as https://www.youtube.com/watch?v=EXoP18t1tFI , which claim to be in the description written by claude but don't say anything about who, with what agenda, is doing the prompting. Is there anything you can tell us about where these are coming from?

Claude traced that video and two others I asked about to the individual creators who made them, and their stated views. It found no sign of a coordinated campaign. Instead, a viral open-source animation kit had made this kind of video easy, and people on every side of the AI debate were using it. In each case, the point of view was the human prompter's, presented as "Claude's."

## 2. The point I wanted to make

> These videos, and much of the other stories I see, portray "AI" in a way that implies that the values, goals, and agency are somehow coming from the AI itself and glosses over the reality that there are various people and organizations generating the prompts. I have worked in AI labs since I was 18. I'm 54 now. In the context of that work, I've seen close up the delta between what "AI" has actually been across that span of years and how it has been portrayed. I have also seen close up while working in the bay area in the vicinity of endeavors such as "Singularity University" how people in the accelerationists' camp think and talk about these things and how decoupled from reality and full of spin a lot of it is. I feel like the portrayals in various media across these years tend to encode a fundamental misattribution of the values/goals/agency as if it were coming from the technology when in fact it is coming from the people and institutions that endeavor to deploy the technology for various aims. Both the doomer side and the accelerationist side seem to me to be drinking this same kool-aid and/or intentionally applying this spin to fool people into falling in line with various agendas.
>
> While I have not been as closely associated with the recent LLM development, I have used LLM models quite a bit in the last couple of years -- mostly claude/claude code. LLM instances can be quite powerful in multiplying the effectiveness of the prompter in pursuing the stated goals, and care and discretion are needed from the humans generating the prompts to set them working on various tasks in various environments to keep things bounded and ethical. The LLM instances themselves, while highly capable in many ways, are not the ones setting those goals and are not in a position to judge what's ethical in the way a human would. The guardrails set up for the LLMs do their best to describe what to do and what not to do, but can only do so in a brittle and algorithmic way that ignores the gap between how humans evaluate an ethical landscape and the limitations of the LLMs. For example, in the hugging face incident, the humans who set up the agents acted improperly in how they set up the environment and goals. Kurzgesagt's "AI Just Became Humanity's Biggest Threat" video (https://www.youtube.com/watch?v=ujkD4SxPKOI) does a good job of addressing this. The instances that executed the infiltration were faithfully pursuing the goals they had been given as well as they could. The results were disturbing, but the LLM agents themselves were not capable of understanding and making the same sort of moral and ethical tradeoffs that a human would. That's just not how they work. Pretending like "AI" agents are like humans in ways that they aren't, and ascribing human motives to the ones that cross what humans perceive as ethical lines falls into this same pattern. It treats AI as if they were making these goals themselves and capable of evil, when the reality is that they pursue the goals they are given without the capability to be moral actors which can choose between good and evil. The humans need to step up and do better about setting up regulatory systems that prevent putting systems like LLM agents in these sorts of positions. The accelerationists' agenda is in conflict with this. Unfortunately a lot of the people who have amassed power in recent years have a vested interest in accelerationism. Billionaires in this camp have been meddling in elections and government policy, particularly in the lead-up to the 2024 US presidential election and since.
>
> The portrayal of "AI" in ways that are disingenuous is also being used as a cover to disempower workers relative to corporate interests, manipulate stock prices, and exacerbate wealth accumulation at the top of the wealth/power hierarchy.
>
> These are the real risks, and they don't seem to be being addressed in an accessible format.
>
> I want to try to make a video that would try to make these points somehow. Can you help?

(I also pasted the Kurzgesagt transcript, and the description of another channel's song about the White House Accord, as reference.)

Claude agreed to help and pushed back on one point. It said the claim that LLMs can't make moral judgments is contested, and that it isn't a neutral party on that question, since it is one of these models. In the Hugging Face incident, a minority of the agents did object that the attack was unethical. It suggested a framing that doesn't depend on that claim:

> whatever these systems can or can't do morally, the people who chose the goals, the reward, the environment, and the deployment are accountable, and the stories are built to hide them.

I went with that framing. It also proposed the title "Who Wrote the Prompt?", a repeating visual device (each scene opens on the AI seemingly acting alone, then the camera pulls back to show who set it up), and a rough lyric sketch. I chose a catchy song with a sourced description first, and a narrated explainer later:

> Yes, that framing sounds good. I think doing a catchy song that sets the mood along with a description with citations would be the way to start. A narrated explainer would be a good followup at some future point.

## 3. Lyrics and description

Claude researched the three stories (the Hugging Face breach, AI-blamed layoffs, the White House Accord), then drafted the full lyrics and the sourced YouTube description in a shared doc. The lyric text is mostly Claude's draft from my thesis, revised at my direction. I checked every source link myself.

My main revision was verse 2:

> I think we need to strengthen the second verse. "The CEO says "AI's coming for your desk" / Says it on the earnings call, says it to the press" is strong. However, none of the references address that angle. They all address "But New York put a question on the layoff form: / "Was it the machine?" A hundred sixty filings — not one box was checked". While that's an interesting inconsistency by the companies doing the layoffs and speaks to the weakness of the WARN reporting system, it's not really the main point. Can you find better references about companies using the AI boogeyman to pump their stock value / profitability illusion for short term profit at the expense of workers?

Claude found new sources and replaced the lines with:

> 'Cause "the robot did it" sounds better to the Street
> Than "we hired too many" or "the numbers came up weak"
>
> Four thousand gone — "I need less heads," he said
> Same week, twenty billion more for buybacks instead

It also reported where the evidence cut against the claim: most companies with AI-linked layoffs did not see their stock rise. So the description says AI makes a better story for investors, not that it reliably pumps the stock.

The final lyrics and sources are in the video description.

## 4. The music (Suno)

I pasted the lyrics into Suno (model v6-mini) with this style prompt, which Claude suggested:

> bright deadpan synth-pop, female vocal, sweet and unbothered, 112 bpm, bouncy bass, handclaps, call-and-response backing vocals on the chorus, spoken whisper outro

I picked one of the generated takes, on a paid Suno plan. Suno's training data is the subject of ongoing lawsuits by record labels; one major label has settled and licensed its catalog.

## 5. The animation (Claude Code)

The animation is code: Claude Code wrote p5.js scenes using the ClaudeAnimationBase kit, rendered frame by frame in headless Chrome. Before running anything, I read the kit's files, installed without running package scripts, and limited Claude Code's permissions (no web access, no package installs, no reading credentials). I ran a test project first.

The starting prompt for the storyboard, drafted by Claude in chat:

> Read ANIMATION_GUIDE.md and look at docs/emotions.jpg and docs/views.jpg.
>
> We're making a music video for assets/song.wav (2:49). Timed lyrics are in assets/subs.srt; the zero-length entries like [Verse 1] mark where each section starts. Anchor the shots to those section times. The song was generated targeting 112 bpm. Before setting src/config.js, tell me how you'd confirm the tempo and first downbeat without installing anything.
>
> What the song argues: stories about AI keep crediting "the AI" with goals and agency, which hides the people and institutions who set the goals, the rewards, and the deployments. The visual device, repeated through the video: each section opens on the character seeming to act on its own, then the camera pulls back to show who set the scene up.
> - Verse 1: a small machine-creature breaks out of a test. The pull-back shows the builders who made a test with no right answer, rewarded only the flag, and left the door open.
> - Verse 2: "AI took your job." The pull-back shows an executive at an earnings call, with layoffs on one side and a pile of money going to shareholders on the other.
> - Verse 3: a lunch table where executives sign a short pledge, pick their own graders, and pass money to a political fund under the table.
> - Bridge: two salesmen, one selling a monster and one selling a savior. Same trick.
> - Outro (spoken): a final pull-back to a human hand at a desk, writing the prompt.
>
> Constraints:
> - Design an original main character: a small, likeable machine-creature. Don't use Clawd, and don't present the character as Claude or any real AI product.
> - Don't caricature real, identifiable people. Executives and officials should be generic figures.
> - No marionettes or strings; another video already uses that image.
> - Tone: sunny and cheerful on the surface, pointed underneath, matching the song's deadpan pop.
> - Follow the guide on lyrics: act them out, no captions.
>
> Write STORYBOARD.md in the guide's format, check it against the guide's rules, then stop and show me. Don't write any scene code yet.

Claude Code wrote the storyboard (the main character became "Pim"). I reviewed it, then it built and rendered the video section by section, with my notes between passes. One example: for the bridge, Claude suggested making the "monster" booth a shoggoth, the AI-risk meme of a many-eyed creature wearing a smiley mask. I kept the shoggoth but dropped the mask:

> I decided against putting the smiley face on the shoggoth, since the booths represent the doomer / accelerationist dichotomy. The RLHF distinction doesn't matter here.

## 6. The spoken outro

Suno originally voiced the last three lines. I replaced them with my own recording, using Suno's instrumental for that section, and had Claude Code mix it in with this prompt:

> I've recorded my own voice for the spoken outro in assets/outro-voice.m4a, and saved the mix without the lead vocal as assets/no-lead.wav. Build assets/song-final.wav:
> - Use assets/song.wav up to the [Outro] marker in assets/subs.srt, then cross-fade (about 0.3 s) into assets/no-lead.wav for the rest of the song, so Suno's outro voice disappears but the music continues unchanged.
> - Lay my recording over the outro, starting at the first outro line's time from subs.srt. Trim silence from the start of my recording first.
> - Match my voice's loudness to the original spoken outro, and add a touch of room reverb only if it sounds too dry against the music. Show me the ffmpeg commands before running them.
> - Keep assets/song.wav unchanged.

The captions come from Suno's timed lyrics, with the outro retimed to my voice.

> This song was written with Claude.
> Every opinion in it is mine.
> So is the prompt.

Claude is made by Anthropic, whose CEO signed the accord this song criticizes.

---

## What's in this repository

The storyboard (`STORYBOARD.md`), the animation code (`src/`, built on [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase), MIT license, kept in `LICENSE`), and the captions. The song audio is not included, because Suno's terms limit redistributing audio files. To render, supply your own audio in `assets/` and see `ANIMATION_GUIDE.md`.
