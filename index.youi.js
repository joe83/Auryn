/**
 * NAB Demo
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';

import { Lander, PDP, Player } from './screens';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import { BackHandler } from '@youi/react-native-youi';

const Stack = createStackNavigator(
  {
    Lander: {
      screen: Lander
    },
    PDP: {
      screen: PDP
    },
    Player: {
      screen: Player
    }
  },
  {
    headerMode: 'none',
    transitionConfig: () => ({
      transitionSpec: {},
      screenInterpolator: () => {
      }
    })
  }
);

export default class YiReactApp extends Component {

  constructor() {
    super();
    BackHandler.addEventListener("onBackButtonPressed", () => {
      let backAction = NavigationActions.back();
      this.stackNavigation.dispatch(backAction);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Stack
          ref={ref => this.stackNavigation = ref}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  }
});

AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
