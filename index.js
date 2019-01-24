/**
 * @flow
 */

import React, { Component } from 'react';
import {
  TouchableOpacity,
  AppRegistry,
  ScrollView,
  StyleSheet,
  Platform,
  WebView,
  Text,
  View
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

const ICON_CHECK = String.fromCharCode(parseInt('e900', 16));
const ICON_UNCHECK = String.fromCharCode(parseInt('e901', 16));
const ICON_REDO = String.fromCharCode(parseInt('e902', 16));
const ICON_UNDO = String.fromCharCode(parseInt('e903', 16));
const ICON_HEADER1 = String.fromCharCode(parseInt('e904', 16));
const ICON_HEADER2 = String.fromCharCode(parseInt('e905', 16));
const ICON_HEADER3 = String.fromCharCode(parseInt('e906', 16));
const ICON_HEADER4 = String.fromCharCode(parseInt('e907', 16));
const ICON_IMAGEFILE = String.fromCharCode(parseInt('e908', 16));
const ICON_KEYBOARD = String.fromCharCode(parseInt('e909', 16));
const ICON_UNORDEREDLIST = String.fromCharCode(parseInt('e910', 16));
const ICON_ORDEREDLIST = String.fromCharCode(parseInt('e911', 16));
const ICON_INDENT = String.fromCharCode(parseInt('e912', 16));
const ICON_OUTDENT = String.fromCharCode(parseInt('e913', 16));
const ICON_BOLD = String.fromCharCode(parseInt('e914', 16));
const ICON_ITALIC = String.fromCharCode(parseInt('e915', 16));
const ICON_QUOTE = String.fromCharCode(parseInt('e916', 16));


export default class WebViewRichEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorStates: [],
      showToolBar: true,
      editorHtml: ''
    }

    this.onMessage = this.onMessage.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.initCommands = this.initCommands.bind(this);

    this.initCommands();
  }

  initCommands() {
    this.commands = [];
    Platform.select({
      ios: () => {
        this.commands.push({
          name: 'INSERTLOCALIMAGE', glyph: ICON_IMAGEFILE, command: JSON.stringify({
            command: 'insertLocalImage'
          })
        });
      },
      android: () => {
        if (Platform.Version >= 19) {
          this.commands.push({
            name: 'INSERTLOCALIMAGE', glyph: ICON_IMAGEFILE, command: JSON.stringify({
              command: 'insertLocalImage'
            })
          });
        }
      }
    })();
    this.commands.push({
      name: 'UNDO', glyph: ICON_UNDO, command: JSON.stringify({
        command: "undo"
      })
    });
    this.commands.push({
      name: 'REDO', glyph: ICON_REDO, command: JSON.stringify({
        command: "redo"
      })
    });
    this.commands.push({
      name: 'INDENT', glyph: ICON_INDENT, command:
      JSON.stringify({
        command: "indent"
      })
    });
    this.commands.push({
      name: 'OUTDENT', glyph: ICON_OUTDENT, command:
      JSON.stringify({
        command: "outdent"
      })
    });
    Platform.select({
      ios: () => {
        this.commands.push({
          name: 'BOLD', glyph: ICON_BOLD, command: JSON.stringify({
            command: "bold"
          })
        });
        this.commands.push({
          name: 'ITALIC', glyph: ICON_ITALIC, command: JSON.stringify({
            command: "italic"
          })
        });
      },
      android: () => {
        if (Platform.Version >= 19) {
          this.commands.push({
            name: 'BOLD', glyph: ICON_BOLD, command: JSON.stringify({
              command: "bold"
            })
          });
          this.commands.push({
            name: 'ITALIC', glyph: ICON_ITALIC, command: JSON.stringify({
              command: "italic"
            })
          });
        }
      }
    })();
    this.commands.push({
      name: 'H1', glyph: ICON_HEADER1, command: JSON.stringify({
        command: "heading1"
      })
    });
    this.commands.push({
      name: 'H2', glyph: ICON_HEADER2, command: JSON.stringify({
        command: "heading2"
      })
    });
    this.commands.push({
      name: 'H3', glyph: ICON_HEADER3, command: JSON.stringify({
        command: "heading3"
      })
    });
    this.commands.push({
      name: 'H4', glyph: ICON_HEADER4, command:
      JSON.stringify({
        command: "heading4"
      })
    });
    Platform.select({
      ios: () => {
        this.commands.push({
          name: 'UNORDERLIST', glyph: ICON_UNORDEREDLIST, command:
          JSON.stringify({
            command: "unorderList"
          })
        });
        this.commands.push({
          name: 'ORDERLIST', glyph: ICON_ORDEREDLIST, command:
          JSON.stringify({
            command: "orderList"
          })
        });
        this.commands.push({
          name: 'BLOCKQUOTE', glyph: ICON_QUOTE, command:
          JSON.stringify({
            command: "quote"
          })
        });
      },
      android: () => {
        if (Platform.Version >= 19) {
          this.commands.push({
            name: 'UNORDERLIST', glyph: ICON_UNORDEREDLIST, command: JSON.stringify({
              command: "unorderList"
            })
          });
          this.commands.push({
            name: 'ORDERLIST', glyph: ICON_ORDEREDLIST, command: JSON.stringify({
              command: "orderList"
            })
          })
          this.commands.push({
            name: 'BLOCKQUOTE', glyph: ICON_QUOTE, command: JSON.stringify({
              command: "quote"
            })
          });
        }
      }
    })();
  }

  componentDidMount() {
    this.initIntervalID = setInterval(() => {
      this.postMessage('init');
    }, 500)
  }

  onMessage(e) {
    let message = e.nativeEvent.data;
		console.log(message);

    if (message == 'loaded' && this.initIntervalID) {
      clearInterval(this.initIntervalID);
      this.initIntervalID = undefined;
      return
    }

    var command = null;
    try {
      command = JSON.parse(message);
    }
    catch (error) {
      return;
    }

    switch (command.command) {
      case 'STATES':
				console.log(command.states);
        this.setState({ editorStates: command.states });
        break;
      case 'HTML':
        this.setState({ editorHtml: command.html });
        break;
    }
  }

  postMessage(str) {
    if (this.webview) {
      this.webview.postMessage(str);
    }
  }

  renderButton() {
    if (this.commands && this.commands.length > 0) {
      return this.commands.map((item, index) => {
        let isChecked = this.state.editorStates.indexOf(item.name) != -1 ? true : false;
        let fontColor = isChecked ? { color: '#5fa137' } : { color: 'black' }

        return (<TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => {
            switch (item.name) {
              case 'INSERTLOCALIMAGE':
                const options = {
                  title: "选择图片",
                  cancelButtonTitle: "取消",
                  takePhotoButtonTitle: "从相机选择",
                  chooseFromLibraryButtonTitle: "从相册选择",
                  storageOptions: {
                    skipBackup: true,
                    path: 'images'
                  }
                };
                ImagePicker.showImagePicker(options, (response) => {
                  if (response.didCancel) {
                  } else if (response.error) {
                  } else if (response.customButton) {
                  } else {
                    let timestamp = new Date().getTime().toString();
                    let base64 = 'data:image/png;base64,' + response.data;
                    this.postMessage(
                      JSON.stringify({
                        command: 'insertLocalImage',
                        id: timestamp,
                        source: base64
                      })
                    );
                  }
                });

                break;
              case 'H1':
              case 'H2':
              case 'H3':
              case 'H4':
              case 'BLOCKQUOTE':
                for (let state of this.state.editorStates) {
                  if (state == item.name) {
                    this.postMessage(JSON.stringify({
                      command: "removeFormat"
                    }));
                    return;
                  }
                }
                this.postMessage(item.command);
                break;
              case 'HIDEKEYBOARD':
                this.webview.blur();
                return;
              default:
                this.postMessage(item.command);
                break;
            }
          } }>
          <Text style={[fontColor, styles.text]} >{item.glyph}</Text>
        </TouchableOpacity>);
      })
    }
    else {
      return null;
    }
  }

  render() {
    const {messagesReceivedFromWebView, message} = this.state;
    const source = Platform.select({
      ios: require('./richeditor.html'),
      android: {uri: 'file:///android_asset/html/richeditor.html'}
    })

    return (
      <View style={styles.container}>
        <WebView
          ref={webview => { this.webview = webview; } }
          source={source}
          onMessage={this.onMessage}
          />
        {
          this.state.showToolBar ?
            <View style={{ height: 50 }}>
              <View style={{
                height: 1,
                alignItems: 'stretch',
                backgroundColor: '#D9E1E9',
              }} />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={styles.buttonContainer}>
                  {
                    this.renderButton()
                  }
                </View>
              </ScrollView>
            </View> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 24,
    fontFamily: "richeditor",
  }
});
