import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
export const observableTypeDocs = [
  {
    slug: "subject",
    title: "Subject",
    exportName: "Subject<T>",
    summary: "Build a synchronous event stream when a producer owns the timing and many consumers may listen.",
    mentalModel: "A Subject is a named room with a set of current listeners. Calling next(value) delivers that value to every listener currently in the room; the Subject does not keep a history for people who arrive later.",
    quickStart: `import { Subject } from "../../vendor/observables/dist/index.js";

type Game = { id: string; title: string; platform: string };

const gameAdded = new Subject<Game>();
const stop = gameAdded.subscribe((game) => addGameToScreen(game));

gameAdded.next({ id: "g-17", title: "Celeste", platform: "Switch" });
stop(); // this screen no longer receives new games`,
    chapters: [
      {
        title: "A Subject is an event source, not stored state",
        paragraphs: [
          "In Game Shelf, use Subject for events such as a game being added or its status changing. The collection service calls next(); open screens can react. This is a hot stream: the source exists independently of its listeners. Under the hood, Subject stores callbacks in a Set, and each unsubscribe removes one callback from that Set.",
          "Hot does not mean asynchronous. In this package next() invokes observers synchronously, in subscription order. When next() returns, every observer in that emission's snapshot has already run. This makes control flow predictable, but it also means a slow observer slows the producer.",
          "Subject does not replay. If gameAdded.next(game) runs before a subscriber is added, that subscriber never sees that game. If consumers need the latest value when they join, use BehaviorSubject instead."
        ],
        miniExample: {
          title: "Publish a game after saving it",
          code: `const gameAdded = new Subject<Game>();

function addGame(game: Game) {
  saveGame(game); // store the record first
  gameAdded.next(game); // then tell current screens
}`
        }
      },
      {
        title: "Subscriptions have an explicit lifetime",
        paragraphs: [
          "subscribe(observer) registers a callback and returns an Unsubscribe function. Keep that function for as long as the consumer is interested, then call it when the owning view, service, or task is finished. Removing one subscription does not affect the others.",
          "A Subject can have zero subscribers and still receive next() calls. Those values are simply discarded: there is no queue, replay buffer, backpressure, or producer cleanup associated with subscriber count. Before notifying, next() copies the Set into an array. That snapshot lets a callback add or remove listeners without changing which callbacks belong to the event already in progress."
        ],
        points: [
          "Unsubscribe is idempotent in practice: deleting an observer that is already absent has no effect.",
          "A listener added while next() is dispatching starts with the next emission, not the current one.",
          "Dispatch iterates a snapshot. If one observer unsubscribes another during an emission, the removed observer is still present in that emission's snapshot and can receive that value once more."
        ],
        miniExample: {
          title: "Release a screen's listener when it closes",
          code: `const stopRecentGames = gameAdded.subscribe((game) => {
  recentGames.prepend(game);
});

closeRecentGamesPanel(() => stopRecentGames());`
        }
      },
      {
        title: "Completion closes the subject",
        paragraphs: [
          "Call complete() when the source will never publish again. Completion clears all currently registered observers. Later next() calls are ignored, and a later subscribe() returns a no-op unsubscribe function without registering the callback.",
          "The API has no completion callback and no error channel. completed is a boolean property for inspecting the terminal state; it does not notify listeners. If a consumer needs a final domain event, publish that event with next() before complete().",
          "Completion belongs to the Subject itself. It is different from calling one subscription's unsubscribe function, which detaches only that observer and leaves the Subject open for everyone else."
        ],
        miniExample: {
          title: "Complete a one-time import stream",
          code: `const importedGame = new Subject<Game>();
importedGame.subscribe((game) => addToCollection(game));

const importedGames: Game[] = [
  { id: "g-17", title: "Celeste", platform: "Switch" },
];
for (const game of importedGames) importedGame.next(game);
importedGame.complete(); // this import source is finished`
        }
      }
    ],
    api: [
      {
        name: "Subject<T>",
        signature: "new Subject<T>()",
        behavior: "Creates an open, hot multicast source with no initial value."
      },
      {
        name: "Observer<T>",
        signature: "(value: T) => void",
        behavior: "The callback accepted by subscribe; value delivery is synchronous."
      },
      {
        name: "subscribe(observer)",
        signature: "(Observer<T>) => Unsubscribe",
        behavior: "Registers an observer and returns the function that removes only that observer."
      },
      {
        name: "Unsubscribe",
        signature: "() => void",
        behavior: "Disposes one subscription."
      },
      {
        name: "next(value)",
        signature: "(value: T) => void",
        behavior: "Synchronously notifies the current observer snapshot; no-op after completion."
      },
      {
        name: "complete()",
        signature: "() => void",
        behavior: "Marks the subject complete and clears all observers."
      },
      {
        name: "completed",
        signature: "get: boolean",
        behavior: "Reports whether complete() has been called."
      }
    ],
    examples: [
      {
        title: "Notify the tracker when a game is added",
        explanation: "The collection service owns the Subject. A list view and a toast can each subscribe; adding one game synchronously notifies both.",
        code: `type Game = { id: string; title: string; platform: string };
const gameAdded = new Subject<Game>();

const stopList = gameAdded.subscribe((game) => addToRecentList(game));
const stopToast = gameAdded.subscribe((game) => showAddedToast(game.title));

function addToCollection(game: Game) {
  saveGame(game);
  gameAdded.next(game);
}

addToCollection({ id: "g-17", title: "Celeste", platform: "Switch" });
stopList();
stopToast();`
      },
      {
        title: "See synchronous updates across collection views",
        explanation: "The count and toast update inside next(). The final line runs only after those current listeners finish.",
        code: `const gameAdded = new Subject<Game>();
gameAdded.subscribe((game) => updateCollectionCount(game));
gameAdded.subscribe((game) => showAddedToast(game.title));

gameAdded.next({ id: "g-17", title: "Celeste", platform: "Switch" });
console.log("The current screens have updated");`
      }
    ],
    takeaways: [
      "Choose Subject for ephemeral events that should reach current listeners, not as a replacement for state that late subscribers must read.",
      "Keep and invoke the unsubscribe returned from each subscription; complete the Subject only when the entire source is permanently finished.",
      "Observer callbacks run synchronously. Exceptions are not converted into stream error notifications and can interrupt next() dispatch.",
      "There are no schedulers, completion callbacks, error callbacks, buffering, or backpressure in this API."
    ]
  },
  {
    slug: "behavior-subject",
    title: "BehaviorSubject",
    exportName: "BehaviorSubject<T>",
    summary: "Represent a current value that can also publish every change to current observers.",
    mentalModel: "A BehaviorSubject combines a value cell with a hot stream. It always has a current value; next(value) replaces that value and broadcasts it, and a new subscriber is immediately given the current value.",
    quickStart: `import { BehaviorSubject } from "../../vendor/observables/dist/index.js";

type Game = { id: string; title: string; platform: string };

const selectedGame = new BehaviorSubject<Game | null>(null);
selectedGame.subscribe((game) => renderGameDetails(game));
// immediately renders the empty selection: null

selectedGame.next({ id: "g-17", title: "Celeste", platform: "Switch" });
console.log(selectedGame.value?.title); // "Celeste"`,
    chapters: [
      {
        title: "When replay changes the design",
        paragraphs: [
          "A plain Subject answers: what game events happen after I subscribe? BehaviorSubject also answers: which game is selected right now? A details panel opened after selection can still initialize from the latest game.",
          "Construction requires an initial value. This is not an optional cache layered on later; the current value exists from the moment the BehaviorSubject is created. Pick a value that faithfully models the initial domain state, or make the type explicitly include an empty/loading state."
        ],
        miniExample: {
          title: "A detail panel can start with no selected game",
          code: `type Game = { id: string; title: string };
const selectedGame = new BehaviorSubject<Game | null>(null);

console.log(selectedGame.value); // null until a player selects a game`
        }
      },
      {
        title: "Subscribe means replay, then observe changes",
        paragraphs: [
          "Inside, BehaviorSubject keeps the current item in a private value field. subscribe(observer) first registers with Subject, then calls the observer with that field. next(game) replaces the field before asking Subject to notify listeners. This is why a callback can read the new .value during the notification.",
          "The replay is synchronous: the callback runs before subscribe() returns. Account for that when initializing local variables or registering other resources around the subscription. The returned Unsubscribe still removes only that listener."
        ],
        points: [
          "value is a synchronous read and does not register an observer.",
          "next(value) stores the new value before broadcasting it, so a listener reading .value during delivery sees the new value.",
          "Each subscriber receives the current value independently; values are not consumed by the first observer."
        ],
        miniExample: {
          title: "A newly opened panel gets the current game first",
          code: `selectedGame.next({ id: "g-17", title: "Celeste" });

const stopPanel = selectedGame.subscribe((game) => {
  renderGameDetails(game); // immediately receives Celeste
});

closeGameDetailsPanel(() => stopPanel());`
        }
      },
      {
        title: "Use it for current state, not an event log",
        paragraphs: [
          "Replay retains exactly one value: the latest one. It does not preserve history, deduplicate equal values, or compare values before publishing. Calling next() with an equal value still notifies observers.",
          "For a sequence such as keystrokes or telemetry where a late listener should not receive an old item, use Subject. For larger state with named actions, derived selectors, or persistence, use vendor/state's createStore instead; BehaviorSubject is deliberately only a small primitive."
        ],
        miniExample: {
          title: "Keep selection state separate from game-opened events",
          code: `import { BehaviorSubject, Subject } from "../../vendor/observables/dist/index.js";

const selectedGame = new BehaviorSubject<Game | null>(null);
const gameOpened = new Subject<Game>();
const game: Game = { id: "g-17", title: "Celeste" };

selectedGame.next(game); // a late detail panel needs this current value
gameOpened.next(game); // a one-time event for current listeners only`
        }
      },
      {
        title: "Completion and a subtle implementation detail",
        paragraphs: [
          "BehaviorSubject inherits complete() and completed from Subject. Existing listeners are removed and future next() calls do not broadcast. The stored value remains readable through .value.",
          "In the current implementation, subscribe() invokes its replay callback even after the parent Subject is complete, because replay happens after the base subscription attempt. Also, next() updates the stored value before the completed Subject ignores the broadcast. Avoid using completion as a terminal-state protocol for BehaviorSubject; represent terminal state in the value itself when consumers need it."
        ],
        miniExample: {
          title: "Why a completed value stream is not a final-state signal",
          code: `const game: Game = { id: "g-17", title: "Celeste" };
selectedGame.complete();
selectedGame.next(game); // current value changes, listeners are not notified

// Keep a state subject open while the app is using it.
// Model "closed" as a value if the UI needs to display that state.`
        }
      }
    ],
    api: [
      {
        name: "BehaviorSubject<T>",
        signature: "new BehaviorSubject<T>(initialValue)",
        behavior: "Creates a Subject with a required initial/current value."
      },
      {
        name: "BehaviorSubject.value",
        signature: "get: T",
        behavior: "Reads the most recently supplied value synchronously."
      },
      {
        name: "subscribe(observer)",
        signature: "(Observer<T>) => Unsubscribe",
        behavior: "Registers the observer and immediately replays the current value."
      },
      {
        name: "next(value)",
        signature: "(value: T) => void",
        behavior: "Stores value and synchronously broadcasts it to current observers."
      },
      {
        name: "complete() / completed",
        signature: "inherited from Subject<T>",
        behavior: "Completes the broadcast source; see the completion note above for replay behavior."
      },
      {
        name: "Observer<T> / Unsubscribe",
        signature: "(value: T) => void / () => void",
        behavior: "Shared observer and teardown types exported from the package entrypoint."
      }
    ],
    examples: [
      {
        title: "Share the current game with panels that open later",
        explanation: "The collection header and the details panel may mount at different times. Both begin with the same selected game because the latest value is replayed.",
        code: `type Game = { id: string; title: string; platform: string };
const selectedGame = new BehaviorSubject<Game | null>(null);

function mountCollectionHeader() {
  return selectedGame.subscribe((game) => updateHeader(game?.title ?? "Library"));
}

selectedGame.next({ id: "g-17", title: "Celeste", platform: "Switch" });
const stopDetails = selectedGame.subscribe((game) => renderGameDetails(game));
stopDetails();`
      },
      {
        title: "Model the selected game with a clear initial value",
        explanation: "The initial null means no game is selected. Once the player chooses one, TypeScript knows that the callback receives a Game.",
        code: `type Game = { id: string; title: string };
const selectedGame = new BehaviorSubject<Game | null>(null);

selectedGame.subscribe((game) => {
  if (game === null) showCollectionPrompt();
  else showGameTitle(game.title);
});`
      }
    ],
    takeaways: [
      "Use BehaviorSubject when subscribers need the latest value immediately, including subscribers that mount later.",
      "Every instance needs a meaningful initial value; use a discriminated union if the domain has loading or empty states.",
      "It stores one value and still broadcasts synchronously. It has no history, equality suppression, error channel, or completion callback.",
      "For structured application state, actions, selectors, and persistence, prefer the higher-level vendor/state package."
    ]
  },
  {
    slug: "observable",
    title: "Observable",
    exportName: "Observable<T>",
    summary: "Wrap a value-producing process as a cold, lazy stream with explicit teardown and small map/filter operators.",
    mentalModel: "An Observable is a recipe for producing values, not a running process. Each call to subscribe executes the recipe and receives its own observer and cleanup function.",
    quickStart: `import { Observable, Subject } from "../../vendor/observables/dist/index.js";

type Game = {
  id: string;
  title: string;
  status: "wishlist" | "backlog" | "playing" | "completed";
};
const collectionChanged = new Subject<void>();

const games$ = new Observable<Game[]>((observer) => {
  observer(readCollection()); // send the starting snapshot
  return collectionChanged.subscribe(() => observer(readCollection()));
});

const stop = games$.subscribe((games) => renderCollection(games));
// Later: stop() detaches this screen from collection changes`,
    chapters: [
      {
        title: "Cold and lazy means work starts at subscribe",
        paragraphs: [
          "The constructor saves your producer function in a private field; it does not call it. subscribe(observer) is the line that runs that saved function. Therefore creating a games$ pipeline does not read the collection or attach listeners yet.",
          "Each subscription invokes the producer again. If the library grid and sidebar each subscribe to games$, each gets its own call to readCollection() and its own listener on collectionChanged. Subject is different: both observers subscribe to the same already-running source.",
          "This makes Observable a useful adapter for a resource with a start/stop lifetime: attach an event listener or timer when a consumer subscribes, then return a function to detach it when that consumer unsubscribes."
        ],
        miniExample: {
          title: "Each game-list subscriber starts its own listener",
          code: `const games$ = new Observable<Game[]>((observer) => {
  console.log("A game-list view subscribed");
  return collectionChanged.subscribe(() => observer(readCollection()));
});

const stopSidebar = games$.subscribe(updateSidebarCount);
const stopGrid = games$.subscribe(renderCollectionGrid);`
        }
      },
      {
        title: "The producer owns setup and teardown",
        paragraphs: [
          "The producer receives an Observer<T>, a callback that accepts each value. It may return an Unsubscribe function; Observable.subscribe returns that function to the caller. If the producer returns nothing, subscribe returns a no-op function.",
          "Unsubscribing does not magically stop arbitrary work. The producer must return cleanup that cancels or detaches that work. If an asynchronous process cannot be cancelled, cleanup can at least prevent it from publishing to resources owned by the subscriber."
        ],
        points: [
          "Call unsubscribe when the consumer's lifetime ends; each subscription has its own teardown.",
          "The producer is invoked synchronously by subscribe(). A synchronous exception from producer setup propagates from subscribe().",
          "There is no built-in complete or error notification. Model terminal events as values or use another abstraction when a terminal channel is required."
        ],
        miniExample: {
          title: "Return the cleanup that removes the collection listener",
          code: `const games$ = new Observable<Game[]>((observer) => {
  const stopListening = collectionChanged.subscribe(() => {
    observer(readCollection());
  });
  return () => stopListening();
});

const stopGrid = games$.subscribe(renderCollectionGrid);
stopGrid(); // runs the producer's cleanup`
        }
      },
      {
        title: "Compose transformations without starting work",
        paragraphs: [
          "map(project) and filter(predicate) each return another Observable. They do not subscribe to the source, so composing a pipeline still does no work until the final Observable is subscribed to.",
          "When subscribed, each operator subscribes to its source and forwards transformed or accepted values. The source cleanup flows back through the chain, so unsubscribing from the final result tears down the original producer.",
          "The package intentionally includes only these two operators. There are no schedulers, retry, merge, switch, buffering, or error-recovery operators; keep additional coordination explicit or choose a larger stream library if the problem requires one."
        ],
        miniExample: {
          title: "Derive a stream of completed games",
          code: `const completedGames$ = games$
  .map((games) => games.filter((game) => game.status === "completed"))
  .filter((games) => games.length > 0);

const stopCompletedList = completedGames$.subscribe(renderCompletedGames);`
        }
      },
      {
        title: "Errors are ordinary JavaScript exceptions here",
        paragraphs: [
          "Observable has one channel: next values. It has no error callback or terminal signal. A synchronous exception in the producer escapes subscribe(); exceptions thrown by project, predicate, or an observer escape the call that was delivering that value.",
          "For asynchronous producers such as a delayed game-catalogue refresh, an exception occurs later in that callback's call stack. This package has no error channel. Catch the failure where the refresh happens or publish a typed result such as { status: 'error', message: 'Catalogue unavailable' }."
        ],
        miniExample: {
          title: "If loading can fail, make failure a value",
          code: `type GameLoad =
  | { status: "success"; games: Game[] }
  | { status: "error"; message: string };

const gameLoads$ = new Observable<GameLoad>((observer) => {
  try {
    observer({ status: "success", games: readCollection() });
  } catch {
    observer({ status: "error", message: "Could not load the collection" });
  }
});`
        }
      }
    ],
    api: [
      {
        name: "Observable<T>",
        signature: "new Observable<T>((observer: Observer<T>) => Unsubscribe | void)",
        behavior: "Stores a cold producer; the producer runs once for each subscription."
      },
      {
        name: "Observer<T>",
        signature: "(value: T) => void",
        behavior: "The producer's value sink and the callback passed to subscribe."
      },
      {
        name: "Unsubscribe",
        signature: "() => void",
        behavior: "Cleanup returned by the producer and exposed to the subscriber."
      },
      {
        name: "subscribe(observer)",
        signature: "(Observer<T>) => Unsubscribe",
        behavior: "Runs the producer and normalizes missing cleanup to a no-op function."
      },
      {
        name: "map<R>(project)",
        signature: "(value: T) => R -> Observable<R>",
        behavior: "Lazily projects each value; project runs during delivery after subscription."
      },
      {
        name: "filter(predicate)",
        signature: "(value: T) => boolean -> Observable<T>",
        behavior: "Lazily forwards values for which predicate returns true."
      }
    ],
    examples: [
      {
        title: "Turn the Add game button into a disposable stream",
        explanation: "Each screen that subscribes gets its own click listener. Returning cleanup removes that exact listener when the screen closes.",
        code: `const addGameButton = document.querySelector("#add-game");

const addGameClicks = new Observable<MouseEvent>((observer) => {
  const listener = (event: MouseEvent) => observer(event);
  addGameButton?.addEventListener("click", listener);
  return () => addGameButton?.removeEventListener("click", listener);
});

const stop = addGameClicks.subscribe(() => openAddGameForm());
// When the collection screen closes:
stop();`
      },
      {
        title: "Build a lazy pipeline for the backlog",
        explanation: "map and filter describe how a game list is transformed. Nothing reads the collection until a view subscribes.",
        code: `const backlogGames$ = games$
  .map((games) => games.filter((game) => game.status === "backlog"))
  .filter((games) => games.length > 0);

// The producer begins here, when this screen subscribes.
const stop = backlogGames$.subscribe(renderBacklog);`
      }
    ],
    takeaways: [
      "Constructing and transforming an Observable does not start it; each subscribe() call starts a fresh producer execution.",
      "Return cleanup from the producer and invoke the returned unsubscribe function to stop the source resource.",
      "map and filter are lazy and preserve teardown through the chain.",
      "There is no error/completion channel or scheduler. Exceptions follow ordinary JavaScript call-stack behavior."
    ]
  }
];
export function createObservableTypePage(slug) {
  const page = document.createElement("docs-observable-type-page");
  page.setAttribute("type", slug);
  return page;
}
defineComponent("docs-observable-type-page", {
  props: {
    type: "string"
  },
  template: ({ type })=>{
    const doc = observableTypeDocs.find((item)=>item.slug === type) ?? observableTypeDocs[0];
    const index = observableTypeDocs.indexOf(doc);
    const previous = observableTypeDocs[(index + observableTypeDocs.length - 1) % observableTypeDocs.length];
    const next = observableTypeDocs[(index + 1) % observableTypeDocs.length];
    return html`
      <article class="docs-page">
        <p class="page-eyebrow">Programming guide · Observables</p>
        <h1>${doc.title}</h1>
        <p class="page-lead">${doc.summary}</p>

        <nav class="component-doc-nav" aria-label="Observable type chapters">
          <a href="/packages/observables">Package overview</a>
          ${repeat(observableTypeDocs, (item)=>item.slug, (item)=>html`
              <a href=${`/packages/observables/${item.slug}`} aria-current=${item.slug === doc.slug ? "page" : null}>${item.title}</a>
            `)}
        </nav>

        <section>
          <h2>The mental model</h2>
          <p>${doc.mentalModel}</p>
        </section>

        <section>
          <h2>The app behind the examples</h2>
          <p>
            Game Shelf stores a collection of games and updates several views:
            the library grid, a recent-games list, and a selected-game panel.
            Each first example introduces the type and stream for its chapter.
            The short snippets that follow build on those names, like the next
            pages of one small application. Helpers such as saveGame() and
            renderCollection() belong to the app; the observable types only
            deliver values and manage subscriptions.
          </p>
        </section>

        <section>
          <h2>First example</h2>
          ${renderCodeExample(doc.quickStart)}
        </section>

        <h2>How to reason about ${doc.exportName}</h2>
        ${repeat(doc.chapters, (chapter)=>chapter.title, (chapter)=>html`
            <section>
              <h3>${chapter.title}</h3>
              ${repeat(chapter.paragraphs, (paragraph)=>paragraph, (paragraph)=>html`<p>${paragraph}</p>`)}
              ${chapter.miniExample ? html`
                  <div class="learning-step">
                    <h4>${chapter.miniExample.title}</h4>
                    ${renderCodeExample(chapter.miniExample.code)}
                  </div>
                ` : null}
              ${chapter.points?.length ? html`<ul>${repeat(chapter.points, (point)=>point, (point)=>html`<li>${point}</li>`)}</ul>` : null}
            </section>
          `)}

        <h2>API at a glance</h2>
        <p>These are the package's public members for this type. The behavior described above is part of the contract, not just a signature detail.</p>
        <div class="api-table-wrap"><table class="api-table">
          <thead><tr><th scope="col">Member</th><th scope="col">Signature</th><th scope="col">What it does</th></tr></thead>
          <tbody>${repeat(doc.api, (item)=>item.name, (item)=>html`
              <tr>
                <td><code>${item.name}</code></td>
                <td><code>${item.signature}</code></td>
                <td>${item.behavior}</td>
              </tr>
            `)}</tbody>
        </table></div>

        <h2>Worked examples</h2>
        ${repeat(doc.examples, (example)=>example.title, (example)=>html`
            <section>
              <h3>${example.title}</h3>
              <p>${example.explanation}</p>
              ${renderCodeExample(example.code)}
            </section>
          `)}

        <h2>Keep in mind</h2>
        <ul>${repeat(doc.takeaways, (item)=>item, (item)=>html`<li>${item}</li>`)}</ul>

        <p class="page-lead component-pagination">
          <a href=${`/packages/observables/${previous.slug}`}>Previous: ${previous.title}</a>
          <span aria-hidden="true"> · </span>
          <a href=${`/packages/observables/${next.slug}`}>Next: ${next.title}</a>
        </p>
      </article>
    `;
  }
});
