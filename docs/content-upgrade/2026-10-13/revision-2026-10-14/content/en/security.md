# Governance that defines agent authority and verifies results

Control requirements increase when a system moves from reading knowledge to sending a message or changing a record. Identity, permissions, approval, and effect verification are designed around those actions and the process's data and risks.

## Identity and access scope

User identity and membership determine what can be read and executed. Organizational and project scope applies to data, retrieval, and tools. A browser-supplied identifier alone is not proof of authority; isolation is tested in both the application and database.

## Policy before execution

Each tool has permitted actions, inputs, outputs, and usage limits. The system checks the request and policy before running it, then verifies the result. Model instructions do not replace these controls, and an MCP connection grants no additional authority.

## Human authorization

Approval presents the proposed action, data, and affected records. It is bound to the authorized person and a fixed request version, with defined expiry. Changed inputs or missing authorization stop execution; a substitute approver is not assumed without a supplied delegation policy.

## Sources remain data

Documents and retrieved results can contain commands that exceed scope or request disclosure. Retrieved content is treated as data and separated from system instructions. Testing includes injection attempts through knowledge, tools, and memory, alongside direct user requests.

## Records connect the decision to its effect

The record identifies the requester, authorizing policy, tool, inputs, and result. Sensitive data is minimized and access and retention are defined. A public operational record or request fingerprint alone does not establish a protected enterprise audit trail.

## Partial failure

A missing response can follow successful execution in the external system. We design state checks and duplicate prevention before retrying, and define reconciliation or compensation when effects cannot be directly reversed.

## Data and deployment

Processing location, providers, encryption, retention, and backups are defined within the project. Private or local deployment requirements are reviewed against infrastructure and integration capabilities. Certifications, data residency, and legal compliance are not guaranteed without evidence for the actual system.

## The public experience

The current assistant is for design and planning with fictional examples, with no enterprise email, payment, or system execution. Read the [data notice](/en/privacy) before submitting information, and the [evaluation approach](/en/methodology) for connected-system development.

[Discuss control requirements](/en/start)
