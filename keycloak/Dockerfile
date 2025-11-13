FROM quay.io/keycloak/keycloak:25.0.2

ENV KC_DB=postgres
ENV KC_DB_USERNAME=keycloak
ENV KC_DB_PASSWORD=keycloakpass
ENV KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak

WORKDIR /opt/keycloak

COPY . .

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
