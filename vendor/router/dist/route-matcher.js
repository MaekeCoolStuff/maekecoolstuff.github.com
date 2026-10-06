function splitPath(path) {
  return path.split("/").filter((segment)=>segment.length > 0);
}
/** Matches `path` (e.g. "/users/42") against a route `pattern` (e.g. "/users/:id"), extracting params. */ export function matchRoute(pattern, path) {
  const patternSegments = splitPath(pattern);
  const pathSegments = splitPath(path);
  if (patternSegments.length !== pathSegments.length) {
    return null;
  }
  const params = {};
  for(let i = 0; i < patternSegments.length; i++){
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];
    if (patternSegment.startsWith(":")) {
      params[patternSegment.slice(1)] = decodeURIComponent(pathSegment);
    } else if (patternSegment !== pathSegment) {
      return null;
    }
  }
  return {
    params
  };
}
