# Enterprise knowledge with answers you can trace

Turn approved policies, operating guides and documents into a knowledge assistant aligned with employee permissions. Its design defines authoritative sources, updates and when to involve the owner.

## Authority comes before indexing

A policy may have duplicate versions, missing dates or outdated guidance still in circulation. We identify ownership, effective versions and applicability before indexing, separating authoritative content from unapproved notes.

## Retrieval follows the question and access rights

For a question, the system selects sources the user may access, then retrieves relevant passages. Keyword and semantic retrieval can be combined with reranking, retaining source and version information for the answer.

This is the role of RAG. Questions connecting contracts, suppliers and projects may benefit from a knowledge graph if the data supports it. Evaluation determines the choice.

## An answer separates source text from interpretation

The output answers within scope, references supporting material and identifies interpretation that belongs to the policy owner. Conflicting versions or insufficient evidence lead to a stated limitation and a clarification path.

In a fictional travel-expense question, the assistant shows permitted policy conditions and their version, requesting missing information needed to apply them. It does not grant financial approval or disclose unrelated records.

## Knowledge needs ownership after launch

Define how new versions are introduced, old ones retired and unanswered questions reviewed. Important answers are retested after updates. Correcting an answer in chat does not automatically update sources or train the model.

[Acceptance testing guide](/en/resources/acceptance-testing)

## What demonstrates a useful pilot

Measure citation accuracy, completeness and appropriate abstention, with cross-role access tests and domain questions in Arabic and English. The current public assistant does not index company documents; that requires a knowledge project, connections and permissions.

## Illustrative output

A fictional example of an output, not a customer record or executed action.

- Question: Who approves travel expenses under policy?
- Reference: Effective version accessible to the user.
- Answer boundary: State role and conditions; no approval or unrelated disclosure.
- On conflict: Escalate to the policy owner with the conflicting versions.

## Primary action

[Prepare your project requirements](/en/start)

## SEO

Enterprise knowledge assistants with references | Agentnexos

Design assistants using approved sources, versions, permissions and references, with tests for gaps and conflicts.
