import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2, AlertTriangle } from 'lucide-react';

const VideoPlayer = ({ src, headers }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const hlsRef = useRef(null);

  useEffect(() => {
    let hls;

    const initPlayer = () => {
      if (!src) return;

      setLoading(true);
      setError(null);

      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          // Custom XHR Setup to attempt header injection
          // Note: Browsers block 'Referer' and 'Origin' in XHR/Fetch for security.
          // We rely on the proxy (corsproxy.io) to handle the actual request.
          xhrSetup: function (xhr, url) {
            xhr.withCredentials = false; // Important for CORS with public proxies

            // We can try to set headers, but browsers will likely ignore/block unsafe ones.
            // If using a custom proxy that accepts X-Headers, we would set them here.
            if (headers) {
              // Attempt to set headers if allowed
              /* 
              Object.entries(headers).forEach(([key, value]) => {
                  try {
                      xhr.setRequestHeader(key, value);
                  } catch (e) {
                      // Ignore errors for forbidden headers
                  }
              });
              */
            }
          }
        });

        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          video.play().catch(e => console.log("Autoplay prevented", e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setLoading(false);
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network error:', data);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Media error:', data);
                hls.recoverMediaError();
                break;
              default:
                console.error('Fatal error:', data);
                setError('Stream failed to load. Please try another server.');
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari (Native HLS)
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          setLoading(false);
          video.play();
        });
        video.addEventListener('error', () => {
          setLoading(false);
          setError('Stream failed to load.');
        });
      } else {
        setError('HLS is not supported in this browser.');
        setLoading(false);
      }
    };

    initPlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, headers]);

  return (
    <div className="video-container" style={{ position: 'relative', width: '100%', height: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10, background: 'rgba(0,0,0,0.5)'
        }}>
          <Loader2 className="loading-spinner" size={48} color="#3b82f6" />
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 10, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '1rem', textAlign: 'center'
        }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <p>{error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        controls
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
