# Patch added in scaler (inspired by rails logic)
There is a patch added in scaler for handling of CSRF token. `app/patches/rack_protection.rb`

- Generation of **authenticity_token** is done by generating a `Se:cureRandom base64` string of length defined in `TOKEN_LENGTH` (as 32) in the constant. This random string is stored in the session cookie in key `csrf` if not already stored. And the masked key is returned as authenticity_token.
- Masking is done by the following process - 
    - decoding the token
    - create a one time padding of same size as TOKEN_LENGTH.
    - doing xor string of decoded token and one_padding_key
    - Add adding the one_padding_key at the start of the new key (so for decoding the key we can slice the one_padding_key and then do XOR again with the second part)
    - At last we will encode it again.
    ```
    # To encode
    token = decode_token(token)
    one_time_pad = SecureRandom.random_bytes(token.length)
    encrypted_token = xor_byte_strings(one_time_pad, token)
    masked_token = one_time_pad + encrypted_token
    encode_token(masked_token)

    # To decode
    token_length = masked_token.length / 2
    one_time_pad = masked_token[0...token_length]
    encrypted_token = masked_token[token_length..-1]
    xor_byte_strings(one_time_pad, encrypted_token)

    def xor_byte_strings(s1, s2)
        s1.bytes.zip(s2.bytes).map { |(c1,c2)| c1 ^ c2 }.pack('c*')
    end
    ```

- Now we have 2 key, one stored in session and another key we should get back in request (which we have sent as authenticity_token)

**Verification**
- Verification is done based on 2 keys. First key we will get from the session and second we can get from different sources (**X_CSRF_TOKEN** Header || authenticity param)
- To compare session_csrf_token and csrf_token (got from request).
    - We first decode the csrf_token
    - unmask the token if required (`length = TOKEN_LENGTH * 2`)
    - compare the unmask_token with decoded session_csrf_token
    - If token is neither mask token (`length = TOKEN_LENGTH*2`) nor unmask token (`length = TOKEN_LENGTH`) we will return false as it was malformed.
 
For encoding and decoding we are using - 
```
Base64.strict_encode64(token)
Base64.strict_decode64(token)
```

# Rails working
Similar Logic is used in internal working of rails (file: [request_forgery_protection.rb](https://github.com/rails/rails/blob/19eebf6d33dd15a0172e3ed2481bec57a89a2404/actionpack/lib/action_controller/metal/request_forgery_protection.rb)), but in that `session[:_csrf_key]` is used for storing and comparing the CSRF token.

> [!note]
> - CSRF token might get change but the base value remain same. As the base value is masked and encoded with random string.
> - New CSRF token get generated after login or sign-up. [reference file](config/initializers/devise.rb:102)

Refs: 


202407151344
