#!/bin/sh
exec java -Xmx"$JAVA_MX" -jar /usr/local/share/java/otp.jar "$@"
