import LoginButton from "../../components/LoginButton";
import "./style.scss";
import ApiClient from "../../api";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Redirect } from "react-router-dom";
import { UserResponse } from "../../AuthedRoute";

const Home = () => {
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    ApiClient.get<UserResponse>("/me").then((res) => {
      const user = res.user;
      if (!!user) {
        setShouldRedirect(true);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (shouldRedirect) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="landing">
      <div className="logo">Skoipy</div>
      <div className="landing-content">
        <h1>Schedule Your Music Discovery</h1>
        <h2>
          Feed in your favorite songs and artists to generate new Spotify
          playlists on an automated schedule
        </h2>
        <LoginButton />
      </div>
    </div>
  );
};

export default Home;
