# Process

## Starting idea and intended user

I wanted a focus timer that feels like travelling alongside a small pixel pet. It is for a student or worker who benefits from a gentle prompt to begin. The user's deliberate start action sends the pet into a side scrolling scene. The moving pet, countdown, progress bar, and eventual discovery show what changed and what to do next.

## Scope and first implementation

The early idea included a detailed daily timetable, many items, and several pet friends. I narrowed it to two ways to begin a journey: selecting one activity from **Today's route**, or preparing an immediate **Focus now** challenge. Both use the same timer and journey panel. Four item types and one unlockable friend provide a small reward loop. A planned time only marks a route as ready; starting still takes a click.

## Revisions from my own testing

In the first version, I hesitated after selecting a route because the start button and completion message appeared inside the quick challenge card. I moved preparation, start, timing, and the report into a separate **Your journey** panel. Both task entry points now lead to it. I also changed the default language to English for the course audience and added a Chinese switch.

Later, I saw the countdown run while the exploration scene looked frozen. I reproduced this in a browser reporting `prefers-reduced-motion: reduce`: the first version disabled the entire canvas animation under that preference. I changed the running scene to animate by default, added a visible motion toggle, and gave the pet clearer side-to-side movement. In that browser, I checked two running frames and saw the pet and scenery in different positions. Switching motion off stopped the scene while the countdown continued.

## Independent user trial and decision

One classmate tried the **Focus now** route: they prepared a quick challenge, started the journey, and looked at the result. I observed that they went through those steps smoothly, with no noticeable pause or confusion. Their feedback was that the current experience felt fine. They suggested future possibilities: meeting more companions, choosing which companion travels with you, uploading a custom companion, and exchanging discoveries for a collection of small items.

I kept the current interaction as it was after this trial. The classmate could complete the intended loop without help, and adding companions, uploads, and an exchange system now would make the project much larger than the one complete interaction this assignment asks for. I kept their ideas as possible future directions rather than claiming those features are implemented.

## AI tools and decisions

I used OpenAI Codex to help plan the scope, implement the HTML, CSS, and JavaScript, debug the animation, and draft documentation. I kept its suggestion to make starting a journey an explicit, visible action. I changed its broader idea for many pet friends and items into a small deterministic collection so I could finish and test the main interaction. I reviewed the interface and tested the running experience myself; the classmate trial above informed the decision to keep the main interaction small.

## Development history

The Git history contains the initial working prototype, a revision to the shared journey panel and bilingual interface, and the animation correction. This submission pass adds documentation, a screenshot, and explicit credits. The current project source and screenshot are original; [CREDITS.md](CREDITS.md) lists the interaction references.
