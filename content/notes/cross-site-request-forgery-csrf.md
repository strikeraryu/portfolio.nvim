# What is CSRF?
**CSRF** is a type of attack where attacker tries to perform a action on some website which was unintentional by the user.

Eg. He can make the API call to backend to perform some important action (like change email, transfer money etc) while using the auth session of the user.
So backend consider him as the real user and perform the action.

> [!note]
> For stateless Apis which are using token based authentication we don't really need CSRF protection.

## Conditions for CSRF
- Some important action - To create some intention to create exploit
- Cookie Based authentication or if auth related header are automatically added by the client - So backend gets fooled user is logged in
- Predictable Params - So attacker can create a exploit

## How to perform
we can create and website which automatically make the api call on visit with the venerable endpoint, or if server is not differentiating between `GET` and `POST` request, then it can be much easier as we can just make simple link which triggered venerable request. like `<img src="https://website.com/risky-path">`

# Prevention of CSRF token
Basically we want way to disrupt attacker flow by adding some randomisation or ensure we are receiving those cookies from the correct place.
- **CSRF token** - Here backend will generate a random, unique csrf-token and share it to client which client need to send back during those important actions.
- **SameSite** - This is restriction by browser, where browser restrict cookies from other websites. Google imposed **Lax SameSite** by default on browser since 2021. (This will help in the condition 2)
- **Referrer based verification** - Backend check the referrer is it originated from correct website. But this is not that safe in comparison of CSRF token.

## CSRF token
We can insert CSRF token in both (header and form data)

If CSRF token is not used properly it can still cause problems.
- Token is not generated based on the session of the user or generated based on a random cookie. In both case attacker can use his own token (from his valid session) or insert the cookie and token to bypass(from his valid session), considering browser allows cookie manipulation.
- Token is not validated properly.
- Store CSRF in the cookie(too avoid server state), and during validation backend just compare both values. If browser provide cookie manipulation, attacker can insert some random pair in both cookie in header. This is also know as **Double Submit Validation**

To avoid all these issue we need to insure there is proper validation of the CSRF, it should be generated randomly while being tied to some cookie related to the session and the token by itself should not be send in the cookies. We can add it as hidden field in a form or can send it as header. But if we send in header we have to make only XHR request we can't use HTLM form native submissions.

## SameSite restriction
This is browser based validation. Browser ensure cookies only added if site in url matches target url. [[site-vs-origin]]

Option browser provide for SameSite -
- **Strict** - Will only send cookies if the site matches between the URL in browser and the site of the target. (not Cross-Site)
- **Lax** (Default) - Will send in cross site if the 2 conditions met - request method is GET and the request result from top level navigation like clicking of link.
- **None** - Will send in all request. When SameSite is None browser must inclute secure parameter to ensure cookies is send over encrypter message as HTTPS.
    - Eg. `Set-Cookie: trackingId=0F8tgdOhi9ynR1M9wa3ODa; SameSite=None; Secure`

Vulnerabilities in SameSite restriction.
- Bypassing Lax using **GET** request for a **POST** request. It can happen is server have to restriction over URL method type and handle all cases.
- Bypassing Strict using redirection which is created on the fly on the client eg. creating using URL params, Then attacker can use this to redirect to a exploit URL and as browser treats redirection also as a request it will send the required cookies.
- Newly issues cookies, if **Lax** is applied automatically (not explicitly by the server) then Lax is applied after 120 seconds to avoid breaking **SSO**. So in this window user is vulnerable to **CSRF**. As in SSO we need to propagate cookie from SSO portal the server we need cross-site request with proper cookies transfer so, if Lax is applied this will be restricted.

## Referrer based validation
It is usually not effective as there are multiple ways to exploit this - 
- Removing the referrer using meta `<meta name="referrer" content="never">`
- Create a domain which contains or start with target domain
    - `http://vulnerable-website.com.attacker-website.com/csrf-attack`
    - `http://attacker-website.com/csrf-attack?vulnerable-website.com`

Refs: 
[[port-swigger-website]]
[Blog related to CSRF](https://portswigger.net/web-security/csrf#what-is-csrf)


202407120131
