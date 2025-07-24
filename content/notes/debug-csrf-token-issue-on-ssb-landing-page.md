## Process
- Added logger in forgery_protection file `actionpack/lib/action_controller/metal/request_forgery_protection.rb`, where we were comparing the csrf token with the session
    - Finding: the session is empty. Is is available in cookie but still empty
- Added few logger statement in Request::Session `actionpack/lib/action_dispatch/request/session.rb`, This used Session::CookieStore And Cookie to populate session `actionpack/lib/action_dispatch/middleware/session/cookie_store.rb`
    - Finding: The cookie store is used the generate the session information. session internal delegates to @_request
    - Finding: Here the session was being added properly. (this mean it was being removed somewhere in middle)
- Added logger statement in `SanitizeQueryStringMiddleware`
    - Finding: The session was not available here
- Inserted the same `SanitizeQueryStringMiddleware` after few middleware
    - Finding: The session was available before Module but not After Module
```
use ActionDispatch::Session::CookieStore
use ActionDispatch::Flash
use ActionDispatch::ContentSecurityPolicy::Middleware
use Rack::Head
use Rack::ConditionalGet
use Rack::ETag
use Rack::TempfileReaper
use Warden::Manager
use RequestMethods::Get::SanitizeQueryStringMiddleware
use ExceptionNotification::Rack
use RequestMethods::Get::SanitizeQueryStringMiddleware
use Module
use RequestMethods::Get::SanitizeQueryStringMiddleware
```
- Logged the caller in `SanitizeQueryStringMiddleware`
    - Finding: There were few middleware being called in rack-protection, Calls after `sanitize_query_string_middleware`(which was added before module)
```
"/opt/rubies/ruby-2.5.9/lib/ruby/gems/2.5.0/gems/rack-protection-2.0.0/lib/rack/protection/xss_header.rb:18:in `call'",
"/opt/rubies/ruby-2.5.9/lib/ruby/gems/2.5.0/gems/rack-protection-2.0.0/lib/rack/protection/base.rb:50:in `call'",
"/opt/rubies/ruby-2.5.9/lib/ruby/gems/2.5.0/gems/rack-protection-2.0.0/lib/rack/protection/base.rb:50:in `call'",
"/opt/rubies/ruby-2.5.9/lib/ruby/gems/2.5.0/gems/rack-protection-2.0.0/lib/rack/protection/path_traversal.rb:16:in `call'",
"/opt/rubies/ruby-2.5.9/lib/ruby/gems/2.5.0/gems/rack-protection-2.0.0/lib/rack/protection/json_csrf.rb:26:in `call'",
"/opt/rubies/ruby-2.5.9/lib/ruby/gems/2.5.0/gems/rack-protection-2.0.0/lib/rack/protection/base.rb:50:in `call'", 
"/opt/rubies/ruby-2.5.9/lib/ruby/gems/2.5.0/gems/rack-protection-2.0.0/lib/rack/protection/base.rb:50:in `call'", 
"/opt/rubies/ruby-2.5.9/lib/ruby/gems/2.5.0/gems/rack-protection-2.0.0/lib/rack/protection/frame_options.rb:31:in `call'", 
"/var/app/current/lib/middleware/request_methods/get/sanitize_query_string_middleware.rb:19:in `call'",
```
- There was a code in rack-protection to drop session in session-hijacking `rack-protection/lib/rack/protection/session_hijacking.rb`
    - Finding: There was a code which compare `tracking` hash in session to env values. There was a difference between `HTTP_ACCEPT_LANGUAGE` of passed and failed request.
```
eg.
"tracking"=>{"HTTP_USER_AGENT"=>"b788e8bc9285a103cf33bb779801fee610547c33", "HTTP_ACCEPT_LANGUAGE"=>"1080c8fd64272bd8596ff2823075c0539cc43d8a"}

## In failed Request
1080c8fd64272bd8596ff2823075c0539cc43d8a

## In passed Request
ccbb6926bb88589901a3aa17d6a6aa49e835e209
```

## Issue
When we open link in Slack, is open chrome in preview mode. On the initial API call of SSB page was `HTTP_ACCEPT_LANGUAGE: en-US` whereas on API call for `user/v2` (for otp) there `HTTP_ACCEPT_LANGUAGE: en-US,en;q=0.9,hi;q=0.8`. 
During the initial API the session cookie set accept-language to `en-us` in tracking.
In then next call the accept-language was set different which caused the mismatch and trigger `session-hijacking` which further dropped the session.


## Hypothesis Testing
- Used Postman to first make API call to SSB page. 
- Then made API call to `user/v2` (using the cookie in previews call) with the CSRF token got in previous call (meta-tags)
- If we keep the accept-language same the CSRF for passed but failed when it was different


## Notes
- Tracking for HTTP_ACCEPT_LANUAGE in already removed in latest version of rack protection
- The issue was happing because old version was used in Scaler Rails Application

Refs: 


202408031506
