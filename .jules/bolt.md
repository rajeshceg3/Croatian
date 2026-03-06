## 2024-05-24 - Hoisting LocalStorage and Combining Filter Loops
**Learning:** `map.js` relied heavily on chained `.filter()` calls within `filterSites` to process multiple UI criteria (category, text search, tags, favorites, visited). This produced unnecessary intermediate arrays. Critically, `getFavorites()` and `getVisited()` were called inside the loop, hitting `localStorage` for every marker evaluated (often 200+ times per keystroke).
**Action:** When filtering map points or performing list operations, always combine filtering criteria into a single pass (`.filter(site => cond1 && cond2)`) instead of chaining (`.filter(cond1).filter(cond2)`). Crucially, hoist expensive operations like `localStorage` reads outside of iteration loops to avoid redundant I/O operations.

## 2025-03-05 - O(N^2) Array Lookups in Rendering Loops
**Learning:** Found multiple instances where `Array.prototype.includes()` was used inside `forEach` loops over the entire GeoJSON dataset to check `favorites` and `visited` arrays. This results in O(N*M) complexity which blocks the main thread during render and filtering.
**Action:** Always convert arrays like `favorites` and `visited` to `Set`s *before* the loop, then use `Set.has()` inside the loop for O(1) lookups. Also, hoisted the `getFavorites()` call outside the loop in `map-module.js` to avoid repeated `localStorage` access and `JSON.parse`.
