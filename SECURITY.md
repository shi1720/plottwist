# Security and privacy

This project does not collect accounts or store server-side quiz answers. See the in-app privacy page and architecture notes for exact data behavior. Shared links are public to recipients and may be logged by infrastructure; they are not encrypted or revocable.

For a sensitive report, use GitHub's private vulnerability reporting if enabled for this repository. If it is unavailable, contact the maintainer through the contact information on their GitHub profile and ask for a private channel; do not post a working exploit or private answers in a public issue. Ordinary reproducible bugs can use the bug report template.

Only trusted candidate code should run in `evaluation/runner.py`. Temporary directories and a timeout do not form a security sandbox.

Release checks include dependency auditing, bounded input parsing, no-secret source review, and a production build. A clean audit is a point-in-time observation, not a guarantee that no vulnerabilities exist. The app has no operational uptime SLA.
