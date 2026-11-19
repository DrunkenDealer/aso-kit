#!/bin/bash
# Stages the fixture app as a git repo: v1.0.0 tagged, then a release's worth of mixed commits.
set -e
here="$(dirname "$0")"
cp -R "$here/../apps/habitly/." .
cp -R "$here/../apps/habitly-live/." .
c() { git -c user.name=Dev -c user.email=dev@example.com commit -qam "$1"; }
mkdir -p shared android
printf 'versionName = "1.0.0"\n' > android/build.gradle.kts
echo '// review' > shared/ReviewView.kt; echo '// widget' > shared/HabitWidget.kt
git init -q && git add -A && c "feat: first release" && git tag v1.0.0
echo '// slipped habits section' >> shared/ReviewView.kt; c "feat: weekly review shows which habits slipped"
echo '// mood next to habits' >> shared/ReviewView.kt; c "feat: mood note shown next to habits in the weekly review"
echo '// refresh on timeline' >> shared/HabitWidget.kt; c "fix: widget took minutes to refresh after a check-off"
echo '// repo' > shared/ReviewRepository.kt; git add -A; c "refactor: move review queries into a repository"
echo '// tests' > shared/ReviewTests.kt; git add -A; c "test: weekly review edge cases"
echo '// debug' > shared/DebugMenu.kt; git add -A; c "feat: debug menu behind a build flag"
printf 'versionName = "1.1.0"\n' > android/build.gradle.kts; c "chore: bump version to 1.1.0"
