![Cover](/assets/blogs/cf-tunnels/header.png)

Usual we need static IP and a DNS provider for hosting our own server. Even after you have a domain name.
Static IP is request to provider a static address for the DNS, provider to route to.

# Cloudflared Tunnel

Cloudflared tunnel creates a secure connection between Cloudflare edge servers and your local server/resources **without requiring a public static IP**. The `cloudflared` daemon establishes a **persistent outbound connection** to Cloudflare’s edge.

Incoming client traffic is routed through Cloudflare’s network and **pushed down the tunnel** to your local server. The response from your server is sent back through the same tunnel and returned to the client.

To use this, you only need - A **registered domain** on Cloudflare.
## How to setup Cloudflared Tunnel

 - Go to Zero Trust Section  
   ![Zero Trust dashboard](/assets/blogs/cf-tunnels/zero-trust.png)

 - Add a team domain name and click on **Next**  
   ![Add team domain](/assets/blogs/cf-tunnels/team-domain.png)

 - Select the **Free Plan**, proceed to payment (no charges will be applied)  
   ![Select Free Plan](/assets/blogs/cf-tunnels/select-plan.png)

 - After the plan is added, navigate to **Networks → Tunnels** in the left sidebar  
   ![Networks → Tunnels](/assets/blogs/cf-tunnels/networks-tunnels.png)

 - Click **Add a Tunnel** → choose **Cloudflared** type and give it a name  
   ![Add Tunnel wizard](/assets/blogs/cf-tunnels/add-tunnel.png)

 - The page will now show commands for your specific environment (mac, Docker, etc.). Follow those to start the tunnel.

- Start a demo server
	- Using docker - `docker run  -p 8080:80 nginx `
	- Or you can create a sample flask app and start it. Create a file app.py with below code and run server using `python app.py`
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask!'

if __name__ == '__main__':
    app.run(debug=True)
```
- After tunnel have started go to add a public host name. 
	- Add subdomain of your choice
	- Type HTTP
	- URL: `localhost:8080` or `localhost:5000` (for Flask app)  
   ![Add public hostname](/assets/blogs/cf-tunnels/add-host-name.png)
- Save the host name and visit the domain.
---
Refs: 
- [Cloudflare Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)

202504111902

