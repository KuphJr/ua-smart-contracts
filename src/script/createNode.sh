#!/usr/bin/env bash

output=$(cast wallet new | sed -n '/Address: /,$p')

addr=$(echo "$output" | grep Address | sed 's/^Address: //')
key=$(echo "$output" | grep Private | sed 's/^Private Key: //')

jq --arg new "$addr" '.addresses? += [$new]' ./keystore.json | sponge ./keystore.json
jq --arg new "0x$key" '.keys? += [$new]' ./keystore.json | sponge ./keystore.json

echo $addr