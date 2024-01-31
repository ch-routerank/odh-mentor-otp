#!/bin/bash -e

# SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
#
# SPDX-License-Identifier: CC0-1.0

# OSM
NORTH_EAST_URL=https://download.geofabrik.de/europe/italy/nord-est-latest.osm.pbf
NORTH_EAST_PBF=data/italy-nord-est.osm.pbf
SOUTH_TYROL_PBF=data/south-tyrol.osm.pbf

# OTP
OTP_IMAGE=docker.io/opentripplanner/opentripplanner:2.5.0_2024-01-19T14-50

# when on github actions then install the required tools
if [ -n "${CI+isset}" ]; then
  sudo apt-get -qq install osmium-tool wget
fi

mkdir -p data

if [ ! -f "${NORTH_EAST_PBF}" ]; then
  wget --progress=bar:force:noscroll ${NORTH_EAST_URL} -O ${NORTH_EAST_PBF}
fi

# cut out South Tyrol from the large North East Italy extract
osmium extract ${NORTH_EAST_PBF} --polygon south-tyrol.geojson -o ${SOUTH_TYROL_PBF} --overwrite

# actually do graph build
docker run \
  -v .:/var/opentripplanner/:z \
  --rm \
  -e JAVA_TOOL_OPTIONS="-Xmx6G" \
  ${OTP_IMAGE} --build --save
