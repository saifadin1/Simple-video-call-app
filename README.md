# Simple-video-call-app

## WebRTC architecture

![alt text](https://github.com/saifadin1/Simple-video-call-app/blob/main/assets/Screenshot%202024-10-11%20021357.png)

### Components:
1. Peer1 and Peer2: These represent the two clients that want to establish a direct connection for communication (audio, video, or data).
2. Signaling Server: A server that facilitates the initial exchange of connection information (like IP addresses and port numbers) between peers. This communication is not part of the media stream but is essential for establishing the connection.
3. NAT (Network Address Translation): A device that allows multiple devices on a local network to share a single public IP address. NAT can complicate peer-to-peer connections because it modifies the IP addresses of packets.
4. STUN Server: A server that helps peers discover their public IP addresses and port numbers behind a NAT. It allows peers to find out how they are reachable from the internet.
5. TURN Server: A server that relays media between peers when a direct connection cannot be established (e.g., due to symmetric NATs or strict firewalls). TURN is used as a fallback to ensure that communication can occur even when direct peer-to-peer connections fail.


### Process:
the WebRTC process involves using a signaling server to set up a connection, STUN servers to discover public IP addresses, and TURN servers to relay data when direct communication is not possible. This architecture allows real-time communication over the internet, overcoming the challenges posed by NAT and firewalls.

* Signaling:
  * Peer1 sends a request to the signaling server to initiate a connection.
  * The signaling server communicates the necessary information (SDP - Session Description Protocol, including ICE candidates) between peer1 and peer2.
* NAT Traversal:
  * Both peers send requests to the STUN server to obtain their public IP addresses and port numbers.
  * The peers use the obtained information to attempt a direct connection. They exchange ICE candidates (potential network paths) via the signaling server.
* Connection Attempt:
  * Peer1 and peer2 try to connect directly to each other using the exchanged candidates.
  * If successful, they establish a peer-to-peer connection, allowing them to send media and data directly without any intermediate server.

