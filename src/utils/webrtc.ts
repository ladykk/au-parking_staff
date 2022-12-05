import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Node } from "../types/setting";
import { Buffer } from "buffer";

export const useWebRTC = (node: Node) => {
  const [isFeedConnected, setFeedConnected] = useState(false);
  const feedRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    (async () => {
      await new Promise((resove) => setTimeout(resove, 1000));
      setFeedConnected(false);
      const webrtc = new RTCPeerConnection({
        iceServers: [
          {
            urls: ["stun:stun.l.google.com:19302"],
          },
        ],
      });

      webrtc.onnegotiationneeded = async () => {
        let offer = await webrtc.createOffer();
        await webrtc.setLocalDescription(offer);
        if (!webrtc.localDescription) return;
        await axios({
          method: "POST",
          baseURL: `http://10.0.0.101:8083/stream/${node.toLowerCase()}/channel/0/webrtc`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            data: Buffer.from(webrtc.localDescription.sdp).toString("base64"),
          },
        })
          .then((response) => {
            webrtc.setRemoteDescription(
              new RTCSessionDescription({
                type: "answer",
                sdp: Buffer.from(response.data, "base64").toString(),
              })
            );
            setFeedConnected(true);
          })
          .catch((err) => {});
      };

      webrtc.ontrack = (event) => {
        if (feedRef.current) {
          feedRef.current.srcObject = event.streams[0];
          feedRef.current.play();
        }
      };

      webrtc.addTransceiver("video", { direction: "sendrecv" });

      const webrtcSendChannel = webrtc.createDataChannel(node.toLowerCase());
      let interval: NodeJS.Timer | null;
      webrtcSendChannel.onopen = () => {
        webrtcSendChannel.send("ping");
        interval = setInterval(() => {
          webrtcSendChannel.send("ping");
        });
      };

      return () => {
        if (interval) clearInterval(interval);
      };
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { feedRef, isFeedConnected };
};
