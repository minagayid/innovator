# Peer-review criteria: code & technical specs

Attack it the way a reviewer who has been paged at 3am for someone else's bug would — assume it will run in production, under real load, with real hostile or careless input.

- **Correctness** — does it actually do what it claims for every input, not just the happy path? Check off-by-one errors, empty/null inputs, boundary values, and the specific edge cases the author was clearly thinking about when they wrote it (those are usually fine) versus the ones they weren't (those are where the bugs live).

- **Security** — injection points, missing input validation, secrets committed in code or logs, unsafe deserialization, auth/authorization checks that can be bypassed or are missing on a path that looks internal but isn't.

- **Error handling** — does it fail loudly and recoverably, or silently and confusingly? Are resources (connections, file handles, locks) cleaned up on the failure path, not just the success path? Do retries have limits and backoff, or can they hammer a struggling dependency?

- **Performance** — obvious inefficiencies in hot paths: N+1 queries, unnecessary work inside a loop, unbounded growth (memory, list size, recursion depth) with no cap.

- **Readability / maintainability** — can someone who isn't the author understand the intent without reading the whole file? Naming, structure, and comments should carry meaning, not just describe what the next line does.

- **Test coverage** — do the tests exercise the risky paths (edge cases, error handling, concurrency) or only the happy path? A green test suite that only tests the easy 80% is worse than an honest gap, because it creates false confidence.

- **Architecture fit** — does this change fit the existing design, or does it fight it — bypassing an abstraction, duplicating logic that already exists elsewhere, or coupling two things that shouldn't know about each other?

- **Concurrency / shared state** — where relevant: race conditions, shared mutable state without protection, assumptions about ordering that aren't guaranteed.
