![Behind the Scenes of CSRF](/assets/blogs/csrf/header.png)

**CSRF** is one of those security issues that’s been around for a long time. There are well-known solutions and standard practices to prevent it — so much so that they’re often taken for granted. But sometimes, it’s worth taking a step back to understand the vulnerability more deeply and how each mitigation actually works under the hood.

A while back, I encountered a tricky CSRF-related issue that led me down a rabbit hole of understanding how **Ruby on Rails** internally handles CSRF protection. That experience inspired this post.

This blog is part one of that journey — focusing on what CSRF really is, the conditions that make it possible, and how different protective mechanisms work. In a future post, I’ll share how Rails tackles CSRF internally, what went wrong in my case, and how I ended up resolving it.

Let’s dive in.

# 💣 What Even Is CSRF?

At its core, **Cross-Site Request Forgery (CSRF)** is about abusing trust. If you’re logged into a website (say, your bank), and then unknowingly visit a malicious site, that site might trick your browser into sending a request to the bank on your behalf. The browser includes your cookies (like session tokens) automatically — so the bank thinks it’s you.

It’s like handing your house keys to a stranger because they asked in the right tone of voice.

Imagine this scenario:

* You’re logged into your account.
* A malicious page includes something like:

```html
<img src="https://bank.com/transfer-money?amount=1000&to=attacker" />
```

* Your browser sees it and thinks, “Sure! Let me attach your auth cookies and fire that off!”

> **_Note_**: If your API uses stateless, token-based authentication in headers (like JWT), CSRF isn’t typically an issue. This mainly affects cookie-based auth.

# 🔑 Conditions That Make CSRF Possible

For a CSRF attack to succeed, a few conditions must align:

* **Important Action**: The targeted action must be meaningful — like changing account details or transferring funds.
* **Cookie-Based Authentication**: If the browser automatically attaches auth cookies or headers, the server is easily fooled.
* **Predictable Parameters**: If request parameters are easy to guess or fixed, attackers can replicate them in malicious payloads.

# 🛠️ How a CSRF Attack Happens

Attackers typically set up a webpage that silently triggers a request to a vulnerable endpoint. For example:

Zoom image will be displayed

```html
<img src="https://website.com/risky-path">
```

Or with a form:

```html
<form action="https://vulnerable.com/update-email" method="POST">  
  <input type="hidden" name="email" value="attacker@example.com" />  
</form>  
<script>document.forms[0].submit()</script>
```

Suddenly, your innocent browsing turns into a silent attack.

# 🛡️ Preventing CSRF Attacks

The goal is to *break the attack chain* — by introducing randomness or validating the origin of requests. Common strategies include:

## 1. CSRF Tokens

The server generates a unique, random token for each user session. This token must be sent back by the client with every sensitive request — via header or hidden form field.

But using CSRF tokens incorrectly opens up vulnerabilities:

* If the token is **not tied to the session**, attackers can use their own token.
* If the token is stored in cookies and validated by simply matching values (called **Double Submit**), an attacker can manipulate both the token and the cookie if the browser allows it.

**Best Practices**:

* Tokens should be **random** and **session-bound**.
* Tokens should **not** be sent in cookies.
* For form-based actions, embed them as **hidden fields**.
* For XHR requests, send them in **custom headers**.

> _Note: If sent via headers, only AJAX/XHR requests are supported — not native HTML forms._

## 2. SameSite Cookie Attribute

This is a browser-level defense that controls when cookies are sent during cross-site requests.

* **Strict**: Cookies are only sent in first-party contexts. Completely blocks CSRF but may break SSO and other flows.
* **Lax (Default)**: Cookies are sent on top-level GET navigations (like clicking a link), but blocked in other cross-site cases.
* **None**: Cookies are sent in all requests, but must include the `Secure` flag (HTTPS only).

`Set-Cookie: sessionId=abc123; SameSite=None; Secure`

### Vulnerabilities in SameSite Protections:

* **Lax Bypass**: If the server treats both GET and POST similarly, attackers can misuse Lax rules.
* **Strict Bypass via Redirection**: Attacker-controlled redirections using URL parameters can indirectly trigger CSRF.
* **Lax Delays**: For SSO flows, browsers delay applying Lax for 120 seconds — creating a window of vulnerability.

## 3. Referrer-Based Validation

Some servers rely on checking the `Referrer` header to ensure requests come from the right origin.

This method is **less secure**, and attackers can bypass it easily:

* Use meta tags to strip the referrer:

```html
<meta name="referrer" content="never">
```

* Host malicious pages on subdomains like:

`http://vulnerable.com.attacker.com`

Referrer validation should *never* be your only line of defense.

# 🔚 Final Thoughts

CSRF is dangerous because it abuses trust — your browser’s trust in cookies, your server’s trust in headers, and the user’s trust in your website.

The good news? It’s preventable. With the right strategies, you can turn this silent threat into a non-issue.

**—**

**Refs:**

* [Port Swigger Labs](https://portswigger.net/web-security/csrf/lab-no-defenses)
* [Blog related to CSRF](https://portswigger.net/web-security/csrf#what-is-csrf)

202504091409
