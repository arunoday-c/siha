import { PureComponent } from "react";
import { checkSecurity } from "../../utils/GlobalFunctions";

export default class AlgaehSecurity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { canRender: false };
  }
  componentDidMount() {
    this.getSecurityCredentials();
  }

  getSecurityCredentials() {
    const _securityType =
      this.props.securityType === undefined
        ? "componet"
        : this.props.securityType;
    checkSecurity({
      securityType: _securityType,
      component_code: this.props.component_code,
      module_code: this.props.module_code,
      screen_code: this.props.screen_code,
      screen_element_code: this.props.screen_element_code,
      hasSecurity: () => {
        const that = this;
        if (that.props.elementLink !== undefined) {
          if (that.props.elementLink.that !== undefined) {
            that.props.elementLink.elements.map(item => {
              if (item.ref !== undefined && item.ref !== "")
                that.props.elementLink.that[item.ref].classList.add("d-none");
              if (item.event !== undefined && typeof item.event === "function")
                item.event();
            });
          }
        }
        this.setState({
          canRender: false
        });
      },
      hasNoSecurity: () => {
        this.setState({
          canRender: true
        });
      }
    });
  }

  render() {
    if (this.state.canRender) return this.props.children;
    else return null;
  }
}
