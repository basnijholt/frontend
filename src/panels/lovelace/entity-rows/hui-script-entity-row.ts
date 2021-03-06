import "@material/mwc-button/mwc-button";
import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
} from "lit-element";
import "../../../components/entity/ha-entity-toggle";
import { UNAVAILABLE_STATES } from "../../../data/entity";
import { HomeAssistant } from "../../../types";
import { hasConfigOrEntityChanged } from "../common/has-changed";
import "../components/hui-generic-entity-row";
import "../components/hui-warning";
import { ActionRowConfig, LovelaceRow } from "./types";

@customElement("hui-script-entity-row")
class HuiScriptEntityRow extends LitElement implements LovelaceRow {
  public hass?: HomeAssistant;

  @property() private _config?: ActionRowConfig;

  public setConfig(config: ActionRowConfig): void {
    if (!config) {
      throw new Error("Configuration error");
    }
    this._config = config;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];

    if (!stateObj) {
      return html`
        <hui-warning
          >${this.hass.localize(
            "ui.panel.lovelace.warning.entity_not_found",
            "entity",
            this._config.entity
          )}</hui-warning
        >
      `;
    }

    return html`
      <hui-generic-entity-row .hass=${this.hass} .config=${this._config}>
        ${stateObj.attributes.can_cancel
          ? html`
              <ha-entity-toggle
                .disabled=${UNAVAILABLE_STATES.includes(stateObj.state)}
                .hass=${this.hass}
                .stateObj=${stateObj}
              ></ha-entity-toggle>
            `
          : html`
              <mwc-button
                @click=${this._callService}
                .disabled=${UNAVAILABLE_STATES.includes(stateObj.state)}
                class="text-content"
              >
                ${this._config.action_name ||
                this.hass!.localize("ui.card.script.execute")}
              </mwc-button>
            `}
      </hui-generic-entity-row>
    `;
  }

  static get styles(): CSSResult {
    return css`
      mwc-button {
        margin-right: -0.57em;
      }
    `;
  }

  private _callService(ev): void {
    ev.stopPropagation();
    this.hass!.callService("script", "turn_on", {
      entity_id: this._config!.entity,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-script-entity-row": HuiScriptEntityRow;
  }
}
