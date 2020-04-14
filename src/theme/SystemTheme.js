import { createMuiTheme } from "@material-ui/core";
import { orange, deepOrange } from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        primary: orange,
        secondary: deepOrange
    }
});

export default theme;