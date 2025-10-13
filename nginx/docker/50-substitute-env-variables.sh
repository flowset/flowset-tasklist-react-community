#!/usr/bin/env sh

#
# Copyright (c) Haulmont 2025. All Rights Reserved.
# Use is subject to license terms.
#

WWW_DIR=/usr/share/nginx/html
INJECT_FILE_SRC="${WWW_DIR}/env.template.js"
INJECT_FILE_DST="${WWW_DIR}/env.js"
envsubst < "${INJECT_FILE_SRC}" > "${INJECT_FILE_DST}"
[ -z "$@" ] && nginx -g 'daemon off;' || $@