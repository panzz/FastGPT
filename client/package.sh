#!/bin/bash
rm -f nodejs.tar
# tar -cf nodejs.tar --recursion --exclude package.sh --exclude .git *
tar -czvf nodejs.tar.gz --exclude 'package*.sh' --exclude '*.tar*' --exclude test --exclude _ref --exclude .git * .env.local .npmrc
# tar -cf nodejs.tar --exclude 'package*.sh' --exclude '*.tar*' --exclude test --exclude _ref --exclude .git *
# 49dc52e6bf2abe5ef6e2bb5b0f1ee2d765b922ae6cc8b95d39dc06c21c848f8c