import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {
  smallBreakPoint,
  mediumBreakPoint,
  largeBreakPoint,
  xLargeBreakPoint,
  xxxLargeBreakPoint,
} from '../utils/css/breakpoints';
import { manifest_fields } from '@pwabuilder/manifest-information';
//import { recordPWABuilderProcessStep } from '../utils/analytics';
import './manifest-info-card'

@customElement('todo-item')
export class TodoItem extends LitElement {
  @property({ type: String }) field: string = "";
  @property({ type: String }) card: string = "";
  @property({ type: String }) fix: string = "";
  @property({ type: String }) status: string = "";
  @property({ type: String }) displayString: string = "";

  @state() isOpen: boolean = false;

  static get styles() {
    return [
      css`
      .iwrapper {
        display: flex;
        column-gap: .5em;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        background-color: #F0F0F0;
        border-radius: var(--card-border-radius);
        padding: .5em;
        margin-bottom: 10px;
        border: 1px solid transparent;
      }
      .clickable:hover {
        cursor: pointer;
        border: 1px solid #CBCDEB;
      }
      .active:hover {
        cursor: pointer;
        border: 1px solid #CBCDEB;
      }
      .iwrapper img {
        height: 16px;
      }
      .enhancement {
        background-color: #F1F2FA;
      }
      .left, .right {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .left {
        gap: .5em;
      }
      .left p {
        margin: 0;
        vertical-align: middle;
        line-height: 16px;
        padding-top: 3px;
      }
      /* < 480px */
      ${smallBreakPoint(css`
      `)}

      /* 480px - 639px */
      ${mediumBreakPoint(css`
      `)}
      /* 640px - 1023px */
      ${largeBreakPoint(css`
      `)}
      /*1024px - 1365px*/
      ${xLargeBreakPoint(css`
      `)}
      /* > 1920px */
      ${xxxLargeBreakPoint(css`
      `)}
    `
    ];
  }

  constructor() {
    super();
  }

  bubbleEvent(){
    if(manifest_fields[this.field]){
      let tooltip = (this.shadowRoot!.querySelector('manifest-info-card') as any);
      tooltip.handleHover(!this.isOpen);
    }

    let event = new CustomEvent('todo-clicked', {
      detail: {
          field: this.field,
          card: this.card,
          fix: this.fix,
          displayString: this.displayString,
          errorString: this.fix
      }
    });
    this.dispatchEvent(event);
  }

  // allows for the retest items to be clicked
  decideClasses(){
    let decision;
    if(this.status === "retest" || this.field.startsWith("Open") || manifest_fields[this.field]){
      decision = true;
    } // else if(sw_fields[field]){}
    else {
      decision = false;
    }

    let enhancement = false;
    if(this.status === "desktop_enhancement"){
      enhancement = true;
    }

    return {iwrapper: true, clickable: decision, enhancement: enhancement}
  }

  triggerHoverState(e: CustomEvent){
    let element = this.shadowRoot!.querySelector(".iwrapper");
    if(e.detail.entering){
      element?.classList.add("active");
      this.isOpen = true;
    } else {
      element?.classList.remove("active");
      this.isOpen = false;
    }
  }

  decideIcon(){
    switch(this.status) {
      case "required":
        return html`<img src=${stop_src} alt="stop result icon"/>`;
      case "retest":
        return html`<img src=${retest_src} style="color: black" alt="retest site icon"/>`;
      case "desktop_enhancement":
        return html`<img src=${enhancement_src} alt="yield result icon"/>`
      default:
        return html`<img src=${yield_src} alt="yield result icon"/>`
    }
  }

  render() {
    return html`
      <div class="${classMap(this.decideClasses())}" @click=${() => this.bubbleEvent()}>
        <div class="left">
          ${this.decideIcon()}
          <p>${this.fix}</p>
        </div>
        ${manifest_fields[this.field] ? 
          html`
            <manifest-info-card .field=${this.field} @trigger-hover=${(e: CustomEvent) => this.triggerHoverState(e)}></manifest-info-card>
          ` 
          : html``}
      </div>
    `;
  }
}

const yield_src = "/assets/new/yield.svg";
const stop_src = "/assets/new/stop.svg";
const retest_src = "/assets/new/retest-black.svg";
const enhancement_src = "/assets/new/enhancement.svg";