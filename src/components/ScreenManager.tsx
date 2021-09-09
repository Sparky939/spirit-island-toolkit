import React from "react";
import MainMenu from "./MainMenu";

export type ScreenKey = "MAIN_MENU" | "RESOURCE_LIBRARY" | "CHARACTER_LIBRARY";

interface ScreenProps {
  screen: ScreenKey;
}

function ScreenManager(props: ScreenProps) {
  const [screen, setScreen] = React.useState<ScreenKey>(props.screen);

  function navigateTo(destination: ScreenKey) {
    setScreen(destination);
  }

  function getContent() {
    switch (screen) {
      case "MAIN_MENU": {
        return <MainMenu navigateTo={navigateTo} />;
      }
      case "CHARACTER_LIBRARY": {
        return (
          <div>
            <button onClick={() => navigateTo("RESOURCE_LIBRARY")}>
              Go to Resources
            </button>
          </div>
        );
      }
      case "RESOURCE_LIBRARY": {
        return (
          <div>
            <button onClick={() => navigateTo("MAIN_MENU")}>
              Go to Main Menu
            </button>
          </div>
        );
      }
    }
  }

  return getContent();
}

export default ScreenManager;
