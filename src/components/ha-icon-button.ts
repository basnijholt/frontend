import "@material/mwc-icon-button";
import {
  customElement,
  html,
  TemplateResult,
  property,
  LitElement,
} from "lit-element";
import "./ha-icon";

@customElement("ha-icon-button")
export class HaIconButton extends LitElement {
  @property() public icon?: string;

  protected render(): TemplateResult {
    return html`
      <mwc-icon-button><ha-icon .icon=${this.icon}></ha-icon></mwc-icon-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-icon-button": HaIconButton;
  }
}
