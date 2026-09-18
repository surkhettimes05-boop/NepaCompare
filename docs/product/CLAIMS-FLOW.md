# Khaacho Claims Assistance Flow

## 1. Scope

Khaacho is not the insurer and must not present itself as the decision-maker for claim approval. The claims module is an assistance and tracking workflow that helps customers and operations teams communicate, submit documents, monitor progress, and record insurer communication.

The system must support operational transparency without guaranteeing an insurer decision.

---

## 2. Claim states

The claim lifecycle is:

- REPORTED
- DOCUMENTS_PENDING
- SUBMITTED_TO_INSURER
- UNDER_REVIEW
- SURVEY_PENDING
- SURVEY_COMPLETED
- APPROVED
- REJECTED
- SETTLED
- CLOSED
- DISPUTED

These states are used for communication and workflow tracking. Khaacho does not auto-approve claims or auto-render insurer decisions.

---

## 3. Customer capabilities

Customers can:

- report a claim
- upload documents
- view claim status
- view insurer reference
- receive status updates
- review notes and communication history relevant to their claim

These features are operational and informational only. They do not guarantee the outcome of the insurer review.

---

## 4. Operations capabilities

Operations staff can:

- create a claim
- assign staff
- verify documents
- update status
- record insurer communication
- add notes
- upload documents
- record external claim reference

All status transitions and note entries must be audited.

---

## 5. Auditing and transparency

Every claim update must be logged with:

- actor id
- action name
- entity type and id
- before state
- after state
- timestamp
- optional note or reason

This ensures that claim progression remains traceable without making automated decisions.

---

## 6. External insurer references

The system may store an insurer-provided reference number, but this should remain clearly identified as external and not as a validation guarantee from Khaacho.

Examples:

- insurer claim reference
- external review ticket
- survey reference

These are recorded as communication metadata, not as insurer approval.

---

## 7. Documents in claims

Claim-related document uploads should be handled through the same secure object-storage workflow used elsewhere in Khaacho.

Document handling must support:

- document upload
- verification
- rejection
- replacement
- access controls
- audit logs

Khaacho must not claim that a claim is approved simply because documents are uploaded or verified.

---

## 8. Operational safety

- Khaacho does not guarantee claim approval.
- Khaacho does not pretend to be the insurer.
- Claim decisions remain with the insurer and/or their formal process.
- Khaacho is a communication, coordination, and tracking layer.
- The system may communicate insurer instructions and customer statuses, but it must not misrepresent that it can decide outcomes.

---

## 9. Implementation notes

The backend should follow this flow:

1. Customer reports a claim.
2. Claim is created in REPORTED state.
3. Staff verifies required documentation and may move the claim to DOCUMENTS_PENDING or SUBMITTED_TO_INSURER.
4. Insurer communication and insurer reference are recorded.
5. The claim moves through review and survey phases as provided by the insurer.
6. Khaacho records updates and notes, but the approval or rejection remains an insurer outcome.
7. Final states such as APPROVED, REJECTED, SETTLED, or DISPUTED are recorded as external operational outcomes, not as decisions by Khaacho itself.

This preserves a clear, honest distinction between Khaacho’s workflow support and the insurer’s legal authority.
