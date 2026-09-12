# Portable tool manifest

The manifest is a provider-neutral source of truth. Its `function` object can be adapted to a function-calling provider:

```json
{
  "type": "function",
  "function": {
    "name": "text_echo",
    "description": "Return the supplied text without external side effects.",
    "strict": true,
    "parameters": {
      "type": "object",
      "properties": {"text": {"type": "string", "minLength": 1}},
      "required": ["text"],
      "additionalProperties": false
    }
  }
}
```

The full manifest adds the result schema, execution mode, approval policy, declared errors, and local fixtures:

- `function.name` is lowercase snake case and stable once published.
- `function.description` states the observable behavior and important limits, not implementation details.
- `function.parameters` is a JSON Schema object. Prefer strict, closed objects and bounded strings, arrays, and numbers.
- `result.schema` is the schema for the successful result only.
- `execution.mode` is `read_only`, `write`, or `destructive`; `external_side_effects` must agree with it.
- `approval.required` is true for `write` and `destructive` tools. `idempotency.required` is true for every mutating tool.
- `errors` gives stable error codes and retryability; callers should not branch on prose.
- `tests` contains local fixtures. A `valid` case must satisfy the input schema; an `invalid` case must fail it.

An adapter should validate both arguments and the handler result. A minimal dispatch sequence is:

```text
parse -> input validate -> approval/idempotency gate -> execute -> output validate -> envelope
```

Keep real credentials and service-specific configuration outside the manifest, in the host's approved secret/configuration mechanism.
