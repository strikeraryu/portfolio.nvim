# Issue
There was a issue where people was facing Invalid **CSRF** token sometimes on the new landing page.

# Debugging Steps
To debug the issue I made few utils based on rails handling of CSRF token.

**To parse Session token**
```
def decrypt_session(cookie_string, mode = 'json')
  serializer = case mode
  when 'json' then JSON
  when 'marshal' then ActiveSupport::MessageEncryptor::NullSerializer
  end

  cookie = CGI::unescape(cookie_string.strip)
  salt = Rails.configuration.action_dispatch.encrypted_cookie_salt
  signed_salt = Rails.configuration.action_dispatch.encrypted_signed_cookie_salt
  key_generator = ActiveSupport::KeyGenerator.new(Rails.application.secrets.secret_key_base, iterations: 1000)
  secret = key_generator.generate_key(salt)[0, 32]
  sign_secret = key_generator.generate_key(signed_salt)

  encryptor = ActiveSupport::MessageEncryptor.new(secret, sign_secret, serializer: serializer)
  result = encryptor.decrypt_and_verify(cookie)

  (mode == 'marshal') ? Marshal.load(result) : result
end
```

**To parse CSRF token**
```
def unmask_token(masked_token)
  # Split the token into the one-time pad and the encrypted
  # value and decrypt it
  token_length = masked_token.length / 2
  one_time_pad = masked_token[0...token_length]
  encrypted_token = masked_token[token_length..-1]
  xor_byte_strings(one_time_pad, encrypted_token)
end

def encode_token(token)
  Base64.strict_encode64(token)
end

def decode_token(token)
  Base64.strict_decode64(token)
end

def xor_byte_strings(s1, s2)
  s1.bytes.zip(s2.bytes).map { |(c1,c2)| c1 ^ c2 }.pack('c*')
end

def due(token)
 d = decode_token(token)
 u = unmask_token(d)
 encode_token(u)
end
```

When we are getting the invalid CSRF I check the `_csrf_token` stored in the session and one we are getting from CSRF token API were not same. 
As there are only 2 possibilities - 
- When there is no CSRF token set in the session, then we will set the token in the session and return it. (after some post processing: masking and encoding)
- If already set, then we will take the token in the session and return it. (After same post processing)

## Example for decoded session key
```
# hash stored in sesson key as cookie
{"session_id"=>"feea3a2fc2767ccd86dea608796eac4d", "csrf"=>"xBjdi6edwHB/PliHmOCyRXm8icmyIq+ydR32rpxygQM=", "tracking"=>{"HTTP_USER_AGENT"=>"2dfbb232ff512e72a82283a1568eef823e148a4f", "HTTP_ACCEPT_LANGUAGE"=>"93e907a51b264df0e61718d072efa751226d7daf"}, "user_return_to"=>"/", "split"=>{}, "_csrf_token"=>"eZbOq5SyBsC0LSQ8/XDyF9285m/jfTnsQnvT+QepUpg="}

# encoded unmask_token
"eZbOq5SyBsC0LSQ8/XDyF9285m/jfTnsQnvT+QepUpg="
```

So the only way the value can be different, was due to some race condition where both api call saw empty csrf token in the session and generated a new key, and the csrf-token api got executed first so it returned a token which got outdated by some other API call which got executed later. This could happen when we open v2 landing page directly with no cookies.
So to verify this we opened the new landing page directly after clearing the cookies (or opening in incognito).

# Fix
To fix this we removed the initial api call and made the API call at the time first POST call.


Refs: 


202407151956
