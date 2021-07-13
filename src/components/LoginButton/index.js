import axios from "axios";
import { useState, useEffect } from "react";
import "./style.scss";

const LoginButton = () => {
  const [spotifyLoginUrl, setSpotifyLoginUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotifyLoginUrl = async () => {
      const data = await axios.get(`/spotify/auth/url`);
      return data.data;
    };
    fetchSpotifyLoginUrl().then((url) => {
      setSpotifyLoginUrl(url);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <div></div>;
  }
  return (
    <a href={spotifyLoginUrl}>
      <div className="login-button">Login with Spotify</div>
    </a>
  );
};

export default LoginButton;
