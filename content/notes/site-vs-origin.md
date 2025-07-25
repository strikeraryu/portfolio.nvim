URL: "https:// app. example .com:400"
- **TLD** - .com 
- **TLD+1** - example
- **Scheme** - https

**TLD - (Top Level Domain)**

> [!info]
> **eTLD** - effective TLD like .co.in and .co.uk

**Site** uses only TLD+1 and scheme
**Origin** uses all - Scheme, port, and full domain.

| url1 | url2 | site | origin |
| ---- | ---- | ---- | ------ |
| https:// app.example.com | https:// blog.example.com | yes | Domain mismatch  |
| https:// app.example.com | https:// app.example.com:8000 | yes | Port mismatch |
| https:// app.example.com | http:// app.example.com | Scheme mismatch | Scheme mismatch |
| https:// app.example.com | https:// app.example.co.in | eTLD mismatch | Domain mismatch |

Refs: 


202407121024
