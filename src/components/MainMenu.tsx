import { ScreenKey } from "./ScreenManager";
import { css, StyleSheet } from "aphrodite";

const styles = StyleSheet.create({
  Button: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
  },
});

interface MainMenuProps {
  navigateTo: (dest: ScreenKey) => void;
}

function MainMenu(props: MainMenuProps) {
  return (
    <div>
      <div
        className={css(styles.Button)}
        onClick={() => props.navigateTo("CHARACTER_LIBRARY")}
      >
        Character Library
      </div>
      <div
        className={css(styles.Button)}
        onClick={() => props.navigateTo("RESOURCE_LIBRARY")}
      >
        References
      </div>
    </div>
  );
}

export default MainMenu;
