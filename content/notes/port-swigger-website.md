email: striker.aryu56@gmail.com
password: C26Fs3m3STS5)#f9^7;H"W;T}3iT76Y!

> [!info]
> Port Swigger is a website for learning, tools, and labs for security related topics.

# CSRF

## [Lab: CSRF vulnerability with no defenses](https://portswigger.net/web-security/csrf/lab-no-defenses)

Base Email: "wiener@normal-user.net"
Request URL to change email: "https://0a7000db03c3703f8193bbda00120057.web-security-academy.net/my-account/change-email"
Payload: email=wiener%40normal-user.net

Created a form with action of change email and value for the desired email.
- Email should be encoded
- Change your own email before sending the exploit as 2 email can't be same.

Visiting links can potential cause CSRF if the page auto_submits forms.

Refs: 


202407120221
