# Governance that defines who can do what, with which data

Enterprise agents need rules that can be enforced and reviewed. Responsibilities, access, approvals, records and recovery belong in the project design and acceptance tests.

## Named responsibility for each decision

The process owner defines acceptable outcomes and exceptions. The technical team manages identity and integrations. Security or data owners review access, providers and retention. An agent does not replace the authorization these roles grant.

## Access follows user identity and task scope

User roles, membership and data boundaries are enforced by services and databases according to the design. Tests include reading out-of-scope records and changing organization identity; hiding interface elements is insufficient.

## Approval describes the action being authorized

An approval request shows the proposed action, material inputs, target and requester. It identifies the approver and expiry. Changing an amount, recipient or action content requires a fresh review before execution.

## Records explain what happened

A project needs traceability for requests, sources, steps, tools, approvals and connected-system results. Record design limits unnecessary sensitive data, defines readers and specifies retention.

A content fingerprint may support comparison but does not by itself prove records cannot be altered. Evidence protection is defined and tested against the task’s risk.

## A document provides information, not authority

Files and messages may contain instructions intended to redirect an agent. External content is treated as untrusted data, while tool policy and authorization remain separate from model-readable text. Tests cover requests for out-of-scope data and unauthorized tools.

## Failure does not justify repeating an action blindly

When a connection drops after submission, the target system must be reconciled before retrying. The design specifies request identifiers, duplicate prevention where the target supports it, and manual reconciliation for uncertain results.

[Acceptance testing guide](/en/resources/acceptance-testing)

## Providers and processing location are project decisions

For each provider, specify the data, purpose, processing location, deletion, retention and contract terms. Calling a deployment cloud or local does not establish compliance or sovereignty. Requirements need specialist review and documented controls.

These are design controls for custom projects, not a certification or a claim that the public experience enables every control. The privacy notice describes current usage.

[Privacy](/en/privacy)

## Primary action

[Prepare your project requirements](/en/start)

## SEO

Agent governance, permissions and approvals | Agentnexos

Define agent identity, access, approvals, records, recovery and providers. Understand project controls and public experience limits.
