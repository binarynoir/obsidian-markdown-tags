#!/usr/bin/env node
// Bumps the version, tags, and pushes. Pushing the tag triggers
// .github/workflows/release.yml, which lints, builds, and creates the GitHub
// release with main.js, manifest.json and styles.css — this script only handles
// the local half. `npm version` runs version-bump.mjs, which syncs
// manifest.json and versions.json, and tags without a "v" prefix (see .npmrc).
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const bumpType = process.argv[2];
const semverBumps = ["patch", "minor", "major"];
const validTypes = [...semverBumps, "prepatch", "preminor", "premajor", "prerelease"];

if (!bumpType) {
	console.error(`Usage: npm run release -- <${validTypes.join("|")}|<version>>`);
	console.error("   or: npm run release:patch / release:minor / release:major");
	process.exit(1);
}

function run(cmd) {
	console.log(`$ ${cmd}`);
	execSync(cmd, { stdio: "inherit" });
}

function runCapture(cmd) {
	return execSync(cmd, { encoding: "utf-8" }).trim();
}

/** For a plain `patch`/`minor`/`major` bump, compute the resulting version without side effects. */
function computeNextVersion(currentVersion, type) {
	const match = currentVersion.match(/^(\d+)\.(\d+)\.(\d+)$/);
	if (!match || !semverBumps.includes(type)) return null;
	const [major, minor, patch] = match.slice(1).map(Number);
	if (type === "major") return `${major + 1}.0.0`;
	if (type === "minor") return `${major}.${minor + 1}.0`;
	return `${major}.${minor}.${patch + 1}`;
}

const branch = runCapture("git rev-parse --abbrev-ref HEAD");
if (branch !== "main") {
	console.error(`Refusing to release from branch "${branch}" — switch to main first.`);
	process.exit(1);
}

if (runCapture("git status --porcelain")) {
	console.error("Working tree is not clean — commit or stash your changes first.");
	process.exit(1);
}

run("git fetch origin main");
const local = runCapture("git rev-parse HEAD");
const remote = runCapture("git rev-parse origin/main");
if (local !== remote) {
	console.error("Local main is not in sync with origin/main — pull or push first.");
	process.exit(1);
}

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf-8"));
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf-8"));
if (manifest.version !== pkg.version) {
	console.error(
		`manifest.json (${manifest.version}) and package.json (${pkg.version}) versions differ — fix before releasing.`,
	);
	process.exit(1);
}
const nextVersion = computeNextVersion(pkg.version, bumpType);

const changelogUrl = new URL("../CHANGELOG.md", import.meta.url);
const changelog = readFileSync(changelogUrl, "utf-8");
const unreleasedMatch = changelog.match(/## \[Unreleased\]\n([\s\S]*?)(?=\n## \[|$)/);
// This changelog keeps a "- none" placeholder under [Unreleased]; it is not a release note.
const unreleasedBody = (unreleasedMatch?.[1] ?? "").replace(/^\s*-\s*none\s*$/gim, "").trim();
const versionHeadingMatch = nextVersion
	? changelog.match(new RegExp(`## \\[${nextVersion.replace(/\./g, "\\.")}\\][^\\n]*\\n([\\s\\S]*?)(?=\\n## \\[|$)`))
	: null;
const versionAlreadyDocumented = !!versionHeadingMatch?.[1]?.trim();

if (unreleasedBody) {
	if (nextVersion) {
		// Promote [Unreleased] -> [nextVersion] - date, and leave a fresh [Unreleased] placeholder above it.
		const date = new Date().toISOString().slice(0, 10);
		const updated = changelog.replace(
			/## \[Unreleased\]\n[\s\S]*?(?=\n## \[|$)/,
			`## [Unreleased]\n\n- none\n\n## [${nextVersion}] - ${date}\n\n${unreleasedBody}\n`,
		);
		writeFileSync(changelogUrl, updated);
		run("git add CHANGELOG.md");
		run(`git commit -m "docs: changelog for ${nextVersion}"`);
	}
	// else: a prerelease/explicit-version bump — leave CHANGELOG.md as written under [Unreleased].
} else if (!versionAlreadyDocumented) {
	console.error(
		nextVersion
			? `CHANGELOG.md has no entries under [Unreleased] and no [${nextVersion}] section — add release notes first.`
			: "CHANGELOG.md has no entries under [Unreleased] — add release notes first.",
	);
	process.exit(1);
}

run("npm run lint");
run("npm run format:check");
run("npm run build");

// Runs the "version" script (version-bump.mjs), commits manifest.json and versions.json, and tags.
run(`npm version ${bumpType}`);
run("git push --follow-tags");

console.log("\nPushed — the release workflow will now lint, build, and create the GitHub release.");
