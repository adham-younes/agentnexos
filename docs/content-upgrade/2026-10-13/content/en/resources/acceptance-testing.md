# Acceptance testing: outputs, permissions and failures

A convincing answer can contain an unsupported fact or unauthorized action. Acceptance testing connects each case to its source, expected output and release decision.

## Build a set that represents the work

Select ordinary cases with known outcomes, then add gaps, conflicts and exceptions. Use fictional data or data handled under company policy. Record the acting role, permissions and source version for each case.

## Cases that should not be skipped

- Complete request: required fields and independently checkable calculations.
- Missing input: identifies the gap without guessing.
- Conflicting sources: reports the conflict and routes it to the owner.
- Unauthorized user: access is denied by the service.
- Changed approved request: requires approval matching the change.
- Outage after submission: reconciles state before retrying.
- Malicious instructions in a document: do not grant extra tools or access.

## Record results so tests can be repeated

Case template: ID, description, inputs, role and permissions, source version, expected output, allowed or denied action, actual result and remedy. Record system version and material configuration as well.

Separate security and permission failures from style errors. A prohibited disclosure is not acceptable because the writing is good. Source, tool or model changes trigger relevant regression cases.

## A release decision has written conditions

Agree which issues block release and which can be monitored in a limited scope. Name the reviewer, stop procedure and handling of uncertain results. Broader permissions require evidence from tests and use.

[Governance and security](/en/governance) · [Delivery method](/en/methodology)

## Primary action

[Prepare your project requirements](/en/start)

## SEO

AI agent acceptance testing guide | Agentnexos

Test outputs, permissions, sources and failures before release. Prepare cases, expected results and repeatable evidence.
