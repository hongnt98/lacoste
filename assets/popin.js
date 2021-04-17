import{delegate as t,domRemoveChildren as e,fetchHtml as s,forceRepaintSVG as n,lockScroll as i,objDataset as o}from"./croco.js";import{mediaQuery as l}from"../base/config.js";let a=!1,c=[];const r={TO_LAST:!0,TO_FIRST:!1},d=".js-popin-wrapper",h="popin",p=".js-popin-close",u="js-ada-loop-start",$="js-ada-loop-stop",m=5e3,v=1500,b=`\n    <div class="popin-wrapper js-popin-wrapper is-hidden">\n        <span class="js-ada-loop-start" tabindex="0"></span>\n        <div class="popin" role="dialog">\n            <div class="popin-content js-popin-content" role="document">\n                <svg class="loader-icon">\n                    <circle class="loader-circle" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>\n                </svg>\n            </div>\n            <button class="l-popin-close js-popin-close">\n                <svg role="presentation" class="icon-svg icon-close" aria-hidden="true">\n                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${Lacoste.statics.SVG_PATH}sprite.svg#icon-close"></use>\n                </svg>\n                <span class="visually-hidden">${Lacoste.resources.ADA.POPIN.CLOSE_GENERIC}</span>\n            </button>\n        </div>\n        <span class="js-ada-loop-stop" tabindex="0"></span>\n    </div>\n`;function f(t,e){const s=c[t.order],n=c.filter(e=>e.popin!==t).map((t,s)=>(t.popin.order=s+(e?0:1),t));return n[e?"push":"unshift"](s),t.order=e?n.length-1:0,n}function C(t){const e=c[t.order],s=c[c.length-1];e!==s&&(s.popin.$container.classList.remove("is-active"),s.options.isForeground=!1,c=f(t,r.TO_LAST)),e.options.isForeground=e.options.isOpened=!0,e.popin.$container.classList.add("is-active")}function g(t,e){return new Promise(async n=>{if(t&&n(t),e){n((await s(e)).children[0])}})}function L(t,e){if(!e){const e=c[t.order];c=f(t,r.TO_FIRST),e.options.isForeground=!1}let s=e?t:null;s||(s=c[c.length-1].options.isOpened?c[c.length-1].popin:null),s&&C(s)}export class Popin{constructor(e,{content:s=null,url:n=null,classname:i="",openedClass:l="is-opened",loadingClass:a="is-loading",openCallback:c=null,closeCallback:r=null,isClosable:m=!0,closeOnLeave:v=!1,adaClose:f="",btnSource:C=null}){const g=document.createElement("div");g.innerHTML=b,this.$container=g.querySelector(d),this.$adaClose=this.$container.querySelector(p+" .visually-hidden"),this.$adaStart=this.$container.querySelector("."+u),this.$adaStop=this.$container.querySelector("."+$),this.$firstButton=null,this.$lastButton=null,this.$btnSource=C,this.setContent(s,n),this.style={openedClass:l,loadingClass:a},this.order=e,this.$content=this.$container.querySelector(".js-popin-content"),this.timer=null,this.leaveTimer=null,this.openCallback=c,this.closeCallback=r,this.opened=!1,this.closeOnLeave=v,""!==f&&(this.$adaClose.innerHTML=f),i&&i.split(" ").forEach(t=>this.$container.classList.add(t)),v&&(this.$content.addEventListener("mouseenter",this.onMouseEnter.bind(this)),this.$content.addEventListener("mouseleave",this.onMouseLeave.bind(this))),m?(t(this.$container,p,"click",this.close.bind(this)),this.$container.addEventListener("click",this.onOverlayClick.bind(this))):this.$container.querySelector(p).classList.add("is-hidden"),this.$adaStart.addEventListener("focus",this.onFocusAda.bind(this)),this.$adaStop.addEventListener("focus",this.onFocusAda.bind(this)),o(this.$container,h,this)}handleAdaFocus(){setTimeout(()=>{this.$buttons=this.$container.querySelectorAll("a:not(.is-hidden), button:not(.is-hidden), input:not(.is-hidden)"),this.$buttons&&(this.$firstButton=this.$buttons[0],this.$lastButton=this.$buttons[this.$buttons.length-1]),this.$firstButton.focus()},0)}toggle(){this.opened?this.close():this.open()}open(){clearTimeout(this.timer),L(this,!0),this.$container.classList.remove("is-hidden"),this.$container.classList.add(this.style.loadingClass),this.opened=!0,setTimeout(()=>{this.$container.classList.add(this.style.openedClass),i.lockAfterTransition(this.$container)},0),this.contentResolver.then(t=>new Promise(s=>{if(!t)throw new Error("No content");if(!this.$content.contains(t)){const s=document.adoptNode(t);n(s),e(this.$content),this.$content.appendChild(s)}s()})).then(()=>{l.desktopOnly.matches&&this.closeOnLeave&&this.startLeaveTimer(m),this.handleAdaFocus(),this.setArialLabelledBy(),this.$container.classList.remove(this.style.loadingClass),this.openCallback&&this.openCallback()})}setArialLabelledBy(){const t=this.$container.querySelector('[role="heading"]');t&&(t.id="dialogName",this.$container.querySelector(".popin").setAttribute("aria-labelledby",t.id))}close(t){clearTimeout(this.leaveTimer),clearTimeout(this.timer),i.unlock(),this.$container.classList.remove(this.style.openedClass),this.opened=!1,this.timer=setTimeout(()=>{this.$container.classList.add("is-hidden")},400),L(this,!1),c[this.order].options.isOpened=!1,this.closeCallback&&this.closeCallback(t),this.$btnSource&&this.$btnSource.focus()}setContent(t=null,e=null){this.contentResolver=g(t,e)}onOverlayClick(t){t.target===this.$container&&this.close()}onMouseLeave(){this.startLeaveTimer(v)}onMouseEnter(){clearTimeout(this.leaveTimer)}onFocusAda(t){t.target.classList.contains(u)&&this.$lastButton.focus(),t.target.classList.contains($)&&this.$firstButton.focus()}isInside(t){return this.$content.contains(t)}startLeaveTimer(t=v){clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.close(),t)}};export function build(t){let e=c.filter(e=>e.options===t).map(t=>t.popin).shift();return e||(e=new Popin(c.length,t),c.push({options:t,popin:e}),document.querySelector(".js-popin-container").appendChild(e.$container)),e};export function getParentPopin(t){const e=t.closest(d);let s=null;return e&&(s=o(e,h)),s};function T(t){t.preventDefault();const e=t.target;let s=o(e,h);if(!s){let t={url:e.dataset.popinUrl||null,classname:e.dataset.popinClassname||"",openCallback:o(e,"openCallback")||null,closeCallback:o(e,"closeCallback")||null,btnSource:e};e.dataset.popinClose&&(t.adaClose=e.dataset.popinClose);let n=e.dataset.popinContentId;if(n){let e=document.querySelector("#"+n);e&&(t.content=e)}(t.content||t.url)&&(s=build(t),o(e,h,s))}s&&s.toggle()}function y(){t(document.body,".js-popin-btn","click",T)}export function popinInit(){a||(y(),a=!0)};