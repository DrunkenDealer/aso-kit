#!/bin/bash
# Stages the fixture app with en-US live and measured, so the localize gate lets a first locale through.
here="$(dirname "$0")"
cp -R "$here/../apps/habitly/." .
cp -R "$here/../apps/habitly-live/." .
