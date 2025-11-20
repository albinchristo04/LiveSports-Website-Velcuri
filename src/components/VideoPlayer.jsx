import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ src, headers }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }

            const hls = new Hls({
                xhrSetup: function (xhr, url) {
                    if (headers) {
                        Object.entries(headers).forEach(([key, value]) => {
                            try {
                                xhr.setRequestHeader(key, value);
                            } catch (e) {
                                console.warn(\`Cannot set header \${key}: \${e.message}\`);
              }
            });
          }
        },
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log("Auto-play prevented:", e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log("Auto-play prevented:", e));
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src, headers]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%' }}
        controls
        playsInline
        poster="https://via.placeholder.com/1280x720?text=Loading+Stream..."
      />
    </div>
  );
};

export default VideoPlayer;
