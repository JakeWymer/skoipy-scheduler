import { useState, useEffect } from "react";
import ApiClient from "../../api";
import Button from "../Button/index";
import { ButtonTheme } from "../Button/types";
import "./style.scss";

const LoginButton = () => {
  const [spotifyLoginUrl, setSpotifyLoginUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotifyLoginUrl = async () => {
      const data = await ApiClient.get(`/spotify/auth/url`);
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
  const handleSpotifyLogin = () => {
    window.location.href = spotifyLoginUrl;
  };
  return (
    <Button
      text="Login with Spotify"
      theme={ButtonTheme.SPOTIFY}
      clickHandler={handleSpotifyLogin}
    />
  );
};

export default LoginButton;
