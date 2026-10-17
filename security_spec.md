# Security Specification: Educational Quiz and Student Session Sync

## 1. Data Invariants
- `quiz_results`: Each document represents a student quiz completion with valid fields (`nama`, `waktu`, `skor`, `jumlahBenar`, `jumlahSalah`). Score must be an integer between 0 and 100. Name must be non-empty string <= 60 characters. Documents can only be created with strict keys and cannot be overwritten or deleted by unauthorized clients.
- `student_sessions`: Each document represents an initial student login session (`nama`, `waktu`, `skor`). Documents can only be created with valid schema.
- Global Default: All other paths are strictly closed by `match /{document=**} { allow read, write: if false; }`.

## 2. Dirty Dozen Payloads (Designed to Fail Security Validation)
1. Injecting massive 10MB string into `nama` field (Denial of Wallet).
2. Omitting required `skor` field in `quiz_results`.
3. Supplying negative `skor` (-50) in `quiz_results`.
4. Supplying out-of-range `skor` (> 100).
5. Supplying negative `jumlahBenar` or out-of-range (> 10).
6. Shadow fields / extra properties injected into `quiz_results` (e.g. `isAdmin: true`, `role: "superuser"`).
7. Non-string `nama` (e.g. boolean or array).
8. Empty `nama` (length 0).
9. Updating or modifying an already recorded `quiz_results` document.
10. Deleting an existing `quiz_results` document.
11. Arbitrary write to unmapped collections (e.g. `/system_configs/malicious`).
12. Overwriting or deleting other students' sessions.

## 3. Test Runner Invariant
All 12 dirty payloads violate strict validation functions and are blocked by the security rules.
