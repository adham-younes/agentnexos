# Design the task that keeps getting stuck

Describe how the request starts and what the team needs to finish it. The assistant helps organize steps, data, approvals and test criteria using fictional information.

## What you can ask for

- Questions that identify missing information before a design.
- A task map covering sources, roles and exceptions.
- An output format and test criteria the team can review.
- A workload baseline calculation or integration requirements within tool limits.

## A design experience with defined limits

Use fictional data only. Sending processes request text and relevant conversation context with Groq through the site server. Do not provide documents, customer data or keys. The assistant is not connected to company systems and cannot email, purchase or pay.

The assistant may suggest assumptions that need review. Ask it to separate your inputs from its assumptions. A suggested value or approval rule is not company policy.

[Privacy](/en/privacy) · [Prepare a project](/en/start)

## Starter prompts

### Purchase request review

Design a purchase-request review using fictional data. Start with missing-information questions, then define inputs, outputs, approvals and exceptions. Do not invent financial limits or select a supplier; do not execute purchases.

### Receivables follow-up

Design an invoice follow-up list and message drafts using fictional data. Separate disputes and uncertain payments; specify finance review before sending. Do not invent amounts or follow-up schedules as approved policy.

### Internal knowledge assistant

Design an assistant for fictional internal policies. Explain source approval, versions, access, references and stopping when evidence is missing. Distinguish retrieval from model training.

### Integration requirements

Help define integration requirements for a fictional business system. Ask about interfaces, identity, permissions, reading, updates, success checks and failures before proposing architecture. Do not assume a working connection.

## Interface and state copy

- `new`: New conversation
- `placeholder`: Describe the task, information source and decision owner…
- `send`: Send request
- `stop`: Stop request
- `copy`: Copy response
- `copied`: Response copied
- `copy_failed`: Could not copy. Select and copy the text.
- `download`: Download conversation
- `jump`: Go to the latest message
- `checking`: Checking connection
- `available`: Limited live experience: design and reading with available tools
- `limit`: Application limit: 1000 requests per 24 hours
- `counter`: {count}/4000 characters
- `context`: Only part of the conversation fits the context limit. Restate important decisions when needed.
- `empty`: Describe the task first.
- `too_long`: Keep the request to 4000 characters or fewer.
- `unavailable`: The assistant connection is unavailable. You can prepare a local brief.
- `rate_limit`: The experience has reached its usage limit. Try later or prepare the local brief.
- `failed`: The request could not finish. No action was performed on company systems.
- `cancelled`: You stopped the request. Review any output shown before cancellation.
- `stage_analysis`: Reviewing the task description
- `stage_design`: Preparing workflow steps
- `stage_review`: Reviewing assumptions and boundaries
- `unknown_error`: We could not verify the request outcome. Review the conversation before retrying.

## Primary action

Send design request

## SEO

Workflow design assistant | Agentnexos

Use fictional data to design task steps, sources, approvals and tests. The public assistant does not execute company actions.
