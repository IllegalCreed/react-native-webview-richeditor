/**
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';

import RichEditor from 'react-native-webview-richeditor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class simple extends Component {
  render() {
    return (
      <View style={styles.container}>
        <RichEditor />
        <KeyboardSpacer/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('simple', () => simple);
