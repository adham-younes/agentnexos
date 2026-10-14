# Receivables follow-up based on each invoice's status

An invoice list does not establish the next appropriate contact. An invoice may be partly paid, disputed, covered by a payment promise, or missing documentation. Assembling this context manually delays follow-up and can produce messages that do not fit the customer's situation.

## A unified view of the case

The solution connects invoice, due-date, and payment information with available dispute and communication records. Sources of truth and update timing are established before cases are prioritized. Organizational rules define priority and responsibility without invented thresholds or contact schedules.

## Daily outputs

The system prepares a work queue with case status, source, missing information, and a proposed step. It can draft a message based on authorized details, then present it to the responsible person under the sending policy.

In a fictional example, a partial payment and an open line-item dispute exist. The output distinguishes the remaining amount from the disputed component and prepares a referral instead of demanding the full amount. The result depends on actual data and policy, not the model's inference alone.

## Separate follow-up from collection

Drafting differs from sending; reading payment status differs from establishing that funds were received. Permissions are defined individually. A message or payment promise is not proof of receipt; the organization's designated payment record is the source.

## Changes and failures

Invoice status is rechecked before sending approved follow-up, particularly if payment or dispute status changed after drafting. If the channel loses its response, message status is checked before sending again.

## What we test

A newly paid invoice, partial payment, dispute, missing contact details, an old record, and an unauthorized sending attempt. Evaluation covers context, amount accuracy, source state, and policy compliance without promising an unmeasured collection rate.

[Define receivables scope](/en/start)
