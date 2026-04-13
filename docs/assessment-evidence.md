# Assessment Evidence Checklist

This file helps you show evidence of your own thinking during the assessment.

## 1. Project Profiling

Show evidence of:

- requirement breakdown
- chosen stack and why
- planned architecture
- simple UML or flow diagram
- implementation milestones

Suggested artifacts to create:

- use case diagram
- component diagram
- ERD or Firestore collection map
- user flow notes

## 2. Test-Driven Development

Show evidence of:

- tests planned before or alongside features
- validation of core logic
- meaningful test names
- tests for failure cases, not only happy paths

Suggested minimum tests:

- auth validation logic
- project creation validation
- comment submission validation
- access control checks in service layer

## 3. Secure By Design

Show evidence of:

- authenticated routes protected
- authorization enforced
- Firestore rules considered
- input validation added
- secrets kept out of source control

Questions to answer in your own notes:

- who can read what data?
- who can write what data?
- how do you stop users editing another developer's project?
- how do you handle invalid or empty input?

## 4. Documentation

Show evidence of:

- README updated
- architecture explained
- setup steps documented
- key tradeoffs documented
- code commented where necessary

## Personal thinking log

Keep short notes during development:

- why you chose the stack
- why you structured data that way
- what tradeoffs you made under time pressure
- what you would improve with more time

This is useful because the assessment explicitly allows AI, but also expects evidence of your own engineering judgment.

