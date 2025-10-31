# Assignment-Timeline-Generator
A tool that automatically breaks down assignment deadlines into clear milestones with calendar sync and timeline tracking

## Secrets and environment variables

This project expects the OpenAI API key to be provided via an environment variable named `OPENAI_API_KEY`.

- For local development: copy `.env.example` to `.env` and set your key there (do not commit `.env`).
- For CI / production: store the secret in your platform's secret manager (GitHub Actions secrets, AWS Secrets Manager, HashiCorp Vault, etc.) and inject it into the runtime environment at deploy time.

If the `OPENAI_API_KEY` environment variable is missing the application will fail fast with a clear error message.

If you believe an API key was accidentally committed, revoke/rotate the key immediately and follow steps to remove it from git history (see next section).

### Removing a leaked secret from git history (brief)

1. Revoke/rotate the leaked key in the provider dashboard.
2. Remove the file from tracking: `git rm --cached .env` and commit.
3. Remove from history (use `git filter-repo` or BFG) — this rewrites history and requires force-push. See these tools' docs before use.
