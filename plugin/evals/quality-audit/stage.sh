#!/bin/bash
# Stages the fixture app the skill works in; runs in the case workspace.
here="$(dirname "$0")"
cp -R "$here/../apps/habitly/." .
cp "$here/draft.json" aso/metadata.json
