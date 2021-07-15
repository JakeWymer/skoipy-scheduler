import LoginButton from "../../components/LoginButton";
import "./style.scss";
import LandingContent from "../../components/LandingContent";
import GoogleLogo from "./Assets/google-sheets-logo.svg";
import CloudLogo from "./Assets/internet-cloud-logo.svg";
import PlayLogo from "./Assets/play-logo.svg";
import Button from "../../components/Button";
import { ButtonTheme } from "../../components/Button/types";
import ClockLogo from "./Assets/clock-logo.svg";
import NewFollowLogo from "./Assets/new-follow-logo.svg";
import PlaylistLogo from "./Assets/playlist-logo.svg";

const Home = () => {
  const handleDiscordButton = () => {
    window.location.href =
      "https://discord.com/api/oauth2/authorize?client_id=857564853743648788&permissions=2150631424&scope=bot%20applications.commands";
  };
  return (
    <div>
      <section className="hero">
        <h1>Skoip Suite</h1>
        <h2>Tools for playlist generation and music discovery</h2>
        <LoginButton />
      </section>

      <section className="discord">
        <h2>Discord Bot</h2>
        <div className="landing-content-row">
          <LandingContent
            logo={PlayLogo}
            info="Play Spotify playlists, albums, and tracks in your Discord server"
          />
          <LandingContent
            logo={GoogleLogo}
            info="Integrate with Google Sheets to randomly queue up your playlists"
          />
          <LandingContent
            logo={CloudLogo}
            info="Control via webhooks, allowing integration with tools such as StreamDeck"
          />
        </div>
        <div className="discord-button">
          <Button
            text="Add to Discord server"
            theme={ButtonTheme.DISCORD}
            clickHandler={handleDiscordButton}
          />
        </div>
      </section>

      <section className="playlist-generator">
        <h2>Playlist Generator</h2>
        <div className="landing-content-row">
          <LandingContent
            logo={PlaylistLogo}
            info="Add seed artists, tracks, and genres to generate new playlists on the fly"
          />
          <LandingContent
            logo={ClockLogo}
            info="Set up playlists to automatically generate on a recurring schedule"
          />
          <LandingContent
            logo={NewFollowLogo}
            info="Follow your friends' generators to automatically add them to your Spotify library"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
