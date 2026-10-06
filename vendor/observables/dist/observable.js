/**
 * A cold, lazy stream: the producer only runs once someone subscribes.
 * Deliberately minimal — only `map`/`filter`, no full operator set.
 */
export class Observable {
  #producer;
  constructor(producer){
    this.#producer = producer;
  }
  subscribe(observer) {
    const cleanup = this.#producer(observer);
    return typeof cleanup === "function" ? cleanup : ()=>{};
  }
  map(project) {
    return new Observable((observer)=>this.subscribe((value)=>observer(project(value))));
  }
  filter(predicate) {
    return new Observable((observer)=>this.subscribe((value)=>{
        if (predicate(value)) {
          observer(value);
        }
      }));
  }
}
