#!/bin/bash
/opt/keycloak/bin/kc.sh import \
  --file /opt/keycloak/realm-export.json \
  --override true
