!function(){function e(){v()}function t(e,t){var r=n(e),o=e.dataset.property;o.indexOf("Radius")>0?r=c(e,r,o):"transparent"!==r||e.checked||(e=document.querySelector('input[data-property="'+o+'"][type="color"]'),r=n(e)),o.indexOf("Color")>-1&&"transparent"!==r&&(document.querySelector('input[data-property="'+o+'"][type="checkbox"]').checked=!1),console.log("prop: "+o+" and "+r),t.style[o]=r}function n(e,t){var n=t||e.value,r;return"unit"in e.dataset&&(r=e.dataset.unit,"deg"===r?n="rotate("+n+r+")":n+=r),n}function r(e){function t(e){var t=p.getBoundingClientRect();p.style.left=s+e.clientX-c+"px",p.style.top=d+e.clientY-u+"px"}function n(e){var r=p.getBoundingClientRect();document.removeEventListener("mousemove",t),document.removeEventListener("mouseup",n),p=null,o(r)&&(console.log("over"),i.classList.contains("dropped")||(i.classList.add("dropped"),m.appendChild(i))),o(r)||i.classList.contains("dropped")||(i.style.top="",i.style.left=""),!o(r)&&i.classList.contains("dropped")&&i.parentNode.removeChild(i)}function r(e){var t=y.left-e.width,n=y.right+e.width,r=y.top-e.height,o=y.bottom+e.height,a=e.left>t,i=e.right<n,c=e.top>r,u=e.bottom<o;return withinOutter=a&&i&&c&&u}function o(e){var t=y.left,n=y.right,r=y.top,o=y.bottom,a=e.left>t,i=e.right<n,c=e.top>r,u=e.bottom<o;return withinInner=a&&i&&c&&u}function a(e){return r(e)&&!o(e)}var i=e.target,c=e.clientX,u=e.clientY,l=i.getBoundingClientRect(),s=l.left,d=l.top,p=i;document.addEventListener("mousemove",t),document.addEventListener("mouseup",n)}function o(e){var t=window.getComputedStyle(e,null),n=e.style.transform,r,o,a;Array.prototype.forEach.call(h,function(e){var o=e.dataset.property;r="transform"===o?n:t[o],a=b.extractValueForInput(r),1===a.length&&e.dataset.ellipse?e.value=0:2!==a.length||e.dataset.ellipse?2===a.length&&"vertical"===e.dataset.ellipse?e.value=a[1]:"transparent"===a[0]&&"checkbox"!==e.getAttribute("type")?e.value="#000000":"transparent"===a[0]&&"checkbox"===e.getAttribute("type")?(e.value=a[0],e.checked=!0):o.indexOf("Color")>-1&&"checkbox"===e.getAttribute("type")&&"transparent"!==a[0]?e.checked=!1:e.value=a[0]:e.value=0,"range"===e.getAttribute("type")&&u(e)})}function a(e){var t=document.getElementsByClassName("focus");Array.prototype.forEach.call(t,function(e){e.classList.remove("focus")}),e.classList.add("focus"),o(e)}function i(){var e;null===g.querySelector("div")&&(e=document.createElement("div"),e.classList.add("shape"),g.appendChild(e),a(e))}function c(e,t,r){var o,a,i;return"ellipse"in e.dataset&&(i=e.getAttribute("type"),"horizontal"===e.dataset.ellipse?(o="vertical",a=document.querySelector('[data-property="'+r+'"][data-ellipse="'+o+'"][type="'+i+'"]'),t=t+" "+n(a)):"vertical"===e.dataset.ellipse&&(o="horizontal",a=document.querySelector('[data-property="'+r+'"][data-ellipse="'+o+'"][type="'+i+'"]'),t=n(a)+" "+t)),t}function u(e){var t=n(e),r=e.getAttribute("class"),o=document.querySelector(".output."+r);o.innerHTML=t}function l(e){var n=e.target,r=document.querySelector(".focus");r&&(t(n,r),u(n))}function s(e){var n=e.target,r=document.querySelector(".focus");r&&t(n,r)}function d(e){var t=e.target;t.classList.contains("shape")&&(a(t),r(e))}function p(){var e=document.querySelector(".focus"),t=e.cloneNode(!1);m.appendChild(t),a(t)}function v(){var e=document.getElementById("duplicate");f.addEventListener("click",i),document.addEventListener("mousedown",d),e.addEventListener("click",p),Array.prototype.forEach.call(h,function(e){var t=e.getAttribute("type");"range"===t?e.addEventListener("input",l):"checkbox"===t?e.addEventListener("change",s):e.addEventListener("input",s)})}var f=document.getElementById("add"),g=document.getElementById("staging"),m=document.getElementById("canvas"),y=m.getBoundingClientRect(),h=document.querySelectorAll("input"),b={convertToCamelCase:function(e){var t,n,r,o,a;if(e.indexOf("-")>=0){t=e.split("-");for(var i=1;i<t.length;i++)r=t[i],o=t[i].slice(1),n=r[0].toUpperCase(),a=n+o,t[i]=a;return t.join("")}return e},isRgb:function(e){return e.indexOf("rgb(")>-1},isHex:function(e){return(4===e.length||7===e.length)&&"#"===e[0]},convertRgbToHex:function(e){var t=e.slice(4,-1),n=t.split(","),r=Number(n[0].trim()),o=Number(n[1].trim()),a=Number(n[2].trim());return"#"+((1<<24)+(r<<16)+(o<<8)+a).toString(16).slice(1)},areBorderRadiusEllipseValues:function(e){return!!e.match(/% \d/)},extractValueForInput:function(e){var t,n=[];return this.areBorderRadiusEllipseValues(e)?(e=e.replace(/%/g,""),e.split(" ")):this.isRgb(e)?(t=this.convertRgbToHex(e),n[0]=t,n):"rgba(0, 0, 0, 0)"===e?(n[0]="transparent",n):(t=e.replace(/\D/g,""),n[0]=t,n)}};e()}();