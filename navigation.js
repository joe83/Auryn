import * as Screens from './screens';
import { createStackNavigator } from 'react-navigation';

const Stack = createStackNavigator(
  {
    Splash: { screen: Screens.Splash },
    Lander: { screen: Screens.Lander },
    PDP: { screen: Screens.PDP },
    Player: { screen: Screens.Player },
    Search: { screen: Screens.Search },
  },
  {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'transparent',
    },
    transitionConfig: () => ({
      transitionSpec: {},
      screenInterpolator: () => {
      }
    })
  }
);

export default Stack