# HTML content
GET http://{{ host }}:{{ port }}/1/exchange/eth/dai

HTTP/* 200

[Asserts]
header "Content-Type" contains "text/html"
xpath "string(//head/title)" contains "Exchange - Convert"
body contains "DeFi"
body contains "YAD"
