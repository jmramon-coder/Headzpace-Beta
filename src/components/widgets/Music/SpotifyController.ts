{/* Update player name in SpotifyController */}
@@ -15,7 +15,7 @@
     window.onSpotifyWebPlaybackSDKReady = () => {
       const player = new window.Spotify.Player({
-        name: 'Headspace Web Player',
+        name: 'Headzpace Web Player',
         getOAuthToken: cb => cb(config.accessToken!),
         volume: 0.5
       });