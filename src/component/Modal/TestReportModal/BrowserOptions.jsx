import React from "react";
import { Checkbox, Switch, Input } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import BrowseDirectory from "component/Global/BrowseDirectory";

/*eslint no-empty: 0*/
const { TextArea } = Input;

/**
 * Adds/removes args in the launcher args string
 * @param {String} launcherArgs
 * @param {String} value
 * @param {Boolean} toggle
 * @returns {String}
 */
export function updateLauncherArgs( launcherArgs, value, toggle ) {
  const args = launcherArgs.split( " " )
    .filter( arg => arg.trim().length )
    .filter( arg => !arg.startsWith( value ) );

  if ( toggle ) {
    args.push( value );
  }

  return args.join( " " );
}


export class BrowserOptions extends AbstractComponent {

  static propTypes = {

  }

  state = {
    headless: true,
    incognito: true,
    launcherArgs: "",
    ignoreHTTPSErrors: false,
    devtools: false,
    browseDirectoryValidateStatus: "",
    browseDirectoryValidateMessage: ""
  }

  constructor( props ) {
    super( props );
    this.inputLauncherArgsRef = React.createRef();
  }

  onChangeCheckbox = ( checked, field ) => {
    this.setState({
      [ field ]: checked
    });
  }

  onSwitchChange = ( checked ) => {
    this.setState({
      headless: !checked
    });
  }

  onCheckMaximize = ( e ) => {
    this.setState({
      launcherArgs: updateLauncherArgs( this.state.launcherArgs, `--start-maximized`, e.target.checked )
    });
  }

  onCheckFullscreen = ( e ) => {
    this.setState({
      launcherArgs: updateLauncherArgs( this.state.launcherArgs, `--start-fullscreen`, e.target.checked )
    });
  }

  onCheckIgnoreHttps = ( e ) => {
    this.setState({
      ignoreHTTPSErrors: e.target.checked,
      launcherArgs: updateLauncherArgs( this.state.launcherArgs, `--ignore-certificate-errors`, e.target.checked )
    });
  }

  onChangeLauncherArgs = ( e ) => {
    this.setState({
      launcherArgs: e.target.value
    });
  }

  getSelectedDirectory = ( selectedDirectory ) => {
    let launcherArgs = this.state.launcherArgs;
    launcherArgs = updateLauncherArgs( launcherArgs, `--disable-extensions-except=${ selectedDirectory }`, true );
    launcherArgs = updateLauncherArgs( launcherArgs, `--load-extension=${ selectedDirectory }`, true );
    this.setState({
      launcherArgs,
      incognito: false,
      headless: false
    });
  }

  render() {
    const checked = !this.state.headless;

    return (
      <ErrorBoundary>

        <div className="run-in-browser__layout">
          <div>
            <Switch
              checkedChildren="On"
              unCheckedChildren="Off"
              checked={ checked }
              onChange={ this.onSwitchChange } />
            { " " } run in browser<Tooltip
              title={ "By default the tests are running in headless mode (faster). "
                  + "But you can switch for browser mode and see what is really happening on the page" }
              icon="question-circle"
            />
          </div>
          <div className="chromium-checkbox-group">
            { " " } <Checkbox
              checked={ this.state.devtool }
              onChange={ e => this.onChangeCheckbox( e.target.checked, "devtool" ) }
            >
                  DevTools
            </Checkbox>

            { " " } <Checkbox
              checked={ this.state.incognito }
              onChange={ e => this.onChangeCheckbox( e.target.checked, "incognito" ) }
            >
                  incognito window
            </Checkbox>
          </div>

        </div>


        <div className="browser-options-layout">
          <div>

            { " " } <Checkbox
              onChange={ this.onCheckMaximize }
            >
                  maximized
            </Checkbox>

            { " " } <Checkbox
              onChange={ this.onCheckFullscreen }
            >
                  fullscreen
            </Checkbox>

            { " " } <Checkbox
              onChange={ this.onCheckIgnoreHttps }
            >
                  ignore HTTPS errors
            </Checkbox>
          </div>

          <div className="ant-form-item-label">
            <label htmlFor="target" title="Additional arguments">
                Additional arguments to Chromium{ " " }
              <a
                onClick={ this.onExtClick }
                href="http://peter.sh/experiments/chromium-command-line-switches/">
                    (list of available options)</a></label>
          </div>

          <TextArea
            onChange={ this.onChangeLauncherArgs }
            ref={ this.inputLauncherArgsRef }
            value={ this.state.launcherArgs }
            placeholder="--start-maximized --ignore-certificate-errors" />


          <BrowseDirectory
            defaultDirectory={ this.state.projectDirectory }
            validateStatus={ this.state.browseDirectoryValidateStatus }
            validateMessage={ this.state.browseDirectoryValidateMessage }
            getSelectedDirectory={ this.getSelectedDirectory }
            label="Chrome extension location (optional)" />

        </div>


      </ErrorBoundary>
    );
  }
}