# Little Journey

Little Journey is a small pixel style focus companion for students and anyone who wants a gentle way to start a task. You choose a task, start a timed journey, and watch a tiny creature explore while you work. Completing a focus journey adds an item to your travel bag; longer journeys reveal different items.

## Try it locally

Requires Node.js 18 or later. There are no packages to install.

```bash
node serve.mjs
```

Open `http://127.0.0.1:4173` in a browser. The static files in `dist/` can also be served by any static web server.

## Main interaction

1. Add an activity to **Today's route** or enter one in **Focus now**. Choose **TRY 1** for a one minute demonstration.
2. Select the route or prepare the quick challenge. The choice appears in the separate **Your journey** panel.
3. Press **Start journey**. The pet runs through a scrolling scene while the countdown and progress bar update.
4. Pause, resume, or end early when needed. On completion, the journey report appears in the same panel and a focus reward goes into the travel bag.

The top right switch changes the interface between English and Chinese. English is the default on a new browser. The **MOTION ON/OFF** button above the scene lets the user stop or restart the animation without pausing the timer. Language, motion choice, plans, and discoveries are saved in that browser's local storage.

## Boundaries

The timer measures elapsed time, not whether the user was focused in another app. Planned activities require an explicit start; the page does not send system notifications. Daily activities can have a journey but only focus journeys earn collectible items. Plans are for the current day and do not sync between devices.

This is an evolving prototype. Before course submission, a separate person still needs to try it, and a screenshot must be added here along with the resulting design decision in `PROCESS.md`.

## Credits and tools

The interface, creature, and scenery are drawn in this project's own HTML, CSS, and JavaScript. No external images, audio, or code were copied. Interaction ideas were informed by [Forest](https://www.forestapp.cc/), [Finch](https://finchcare.com/about-finch), and [Pomofocus](https://pomofocus.io/). OpenAI Codex helped plan and implement the prototype; `PROCESS.md` records the design decisions.
