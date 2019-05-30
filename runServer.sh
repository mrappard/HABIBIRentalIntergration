#!/bin/bash
killall node || true && cd `dirname "$0"` && npm run-script build && node index.js