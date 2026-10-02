// Commit messages follow Conventional Commits: https://www.conventionalcommits.org
// Validated locally by the husky commit-msg hook and in CI on every push and pull request.

// Commits pushed before Conventional Commits were adopted. They are already on GitHub,
// so they are skipped instead of rewriting shared history. Do not add new entries.
const LEGACY_SUBJECTS = [
  'Set up EVUNEL theme repository from Dawn 16.0.0',
  'Grant checks write permission to the Theme Check workflow',
];

export default {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => LEGACY_SUBJECTS.some((subject) => message.startsWith(subject))],
};
