export function filterComboboxOptions(options, query) {
  const search = query.trim().toLocaleLowerCase();
  return options.filter((option)=>option.label.toLocaleLowerCase().includes(search));
}
export function moveComboboxOption(options, active, direction) {
  let index = active < 0 ? direction === 1 ? -1 : 0 : active;
  for(let step = 0; step < options.length; step++){
    index = (index + direction + options.length) % options.length;
    if (!options[index].disabled) return index;
  }
  return -1;
}
