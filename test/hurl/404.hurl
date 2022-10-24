GET http://{{ host }}:{{ port }}/404not-found

HTTP/* 302

[Asserts]
header "Location" == "/1/exchange/eth/dai"
