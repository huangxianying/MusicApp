;(function(window) {

var svgSprite = '<svg>' +
  ''+
    '<symbol id="icon-jianyingsearch" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M822.528 892.096c-19.52 0-37.696-7.424-51.264-20.992l-176.576-176.832c-47.488 28.736-101.568 43.904-156.992 43.904-167.168 0-303.168-136-303.168-303.168 0-167.168 136-303.168 303.168-303.168 167.168 0 303.168 136 303.168 303.168 0 55.68-15.104 109.76-43.904 156.864 0.064 0.064 0.128 0.128 0.192 0.192l176.512 176.512c28.032 28.16 28.032 74.176 0.064 102.528C860.032 884.672 841.856 892.096 822.528 892.096L822.528 892.096zM599.744 665.28l6.08 8.512c1.216 1.664 2.56 3.52 4.096 5.056l176.704 176.96c18.816 18.88 52.608 18.944 71.68 0 19.584-19.84 19.584-52.032-0.064-71.808l-190.08-187.392 5.44-8.384c29.76-45.504 45.504-98.496 45.504-153.216 0-155.136-126.272-281.408-281.408-281.408-155.136 0-281.408 126.272-281.408 281.408 0 155.2 126.272 281.408 281.408 281.408 54.464 0 107.456-15.744 153.344-45.504L599.744 665.28 599.744 665.28zM437.696 645.888c-116.288 0-210.88-94.656-210.88-210.88 0-116.288 94.592-210.88 210.88-210.88 116.224 0 210.88 94.592 210.88 210.88C648.576 551.232 553.92 645.888 437.696 645.888L437.696 645.888zM437.696 245.888c-104.256 0-189.12 84.864-189.12 189.12s84.864 189.12 189.12 189.12 189.12-84.864 189.12-189.12S541.952 245.888 437.696 245.888L437.696 245.888z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-liebiao" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M635.41 451.09 96 451.09l0 49.037 539.41 0L635.41 451.09zM96 745.314l392.298 0 0-49.038L96 696.276 96 745.314zM831.559 205.904 96 205.904l0 49.037 735.559 0L831.559 205.904zM766.176 644.239c-0.025-0.016-0.051-0.108-0.075-0.265-14.409-8.319-31.129-13.081-48.962-13.081-54.161 0-98.075 43.913-98.075 98.075 0 54.16 43.914 98.074 98.075 98.074 54.162 0 98.074-43.914 98.074-98.074 0-7.913-0.944-15.605-2.714-22.977C808.094 688.932 796.533 662.973 766.176 644.239zM717.139 778.006c-27.089 0-49.037-21.949-49.037-49.037 0-27.089 21.948-49.038 49.037-49.038s49.037 21.949 49.037 49.038C766.176 756.057 744.228 778.006 717.139 778.006zM815.213 320.325l-49.037 0c0 0-1.677 313.295-0.075 323.65 22.961 13.257 40.044 35.55 46.398 62.018 2.711 10.498 2.714 17.63 2.714 17.63L815.213 385.708l114.42 98.074 16.347-49.037L815.213 320.325z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
'</svg>'
var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
var shouldInjectCss = script.getAttribute("data-injectcss")

/**
 * document ready
 */
var ready = function(fn){
  if(document.addEventListener){
      document.addEventListener("DOMContentLoaded",function(){
          document.removeEventListener("DOMContentLoaded",arguments.callee,false)
          fn()
      },false)
  }else if(document.attachEvent){
     IEContentLoaded (window, fn)
  }

  function IEContentLoaded (w, fn) {
      var d = w.document, done = false,
      // only fire once
      init = function () {
          if (!done) {
              done = true
              fn()
          }
      }
      // polling for no errors
      ;(function () {
          try {
              // throws errors until after ondocumentready
              d.documentElement.doScroll('left')
          } catch (e) {
              setTimeout(arguments.callee, 50)
              return
          }
          // no errors, fire

          init()
      })()
      // trying to always fire before onload
      d.onreadystatechange = function() {
          if (d.readyState == 'complete') {
              d.onreadystatechange = null
              init()
          }
      }
  }
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

var before = function (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

var prepend = function (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

function appendSvg(){
  var div,svg

  div = document.createElement('div')
  div.innerHTML = svgSprite
  svg = div.getElementsByTagName('svg')[0]
  if (svg) {
    svg.setAttribute('aria-hidden', 'true')
    svg.style.position = 'absolute'
    svg.style.width = 0
    svg.style.height = 0
    svg.style.overflow = 'hidden'
    prepend(svg,document.body)
  }
}

if(shouldInjectCss && !window.__iconfont__svg__cssinject__){
  window.__iconfont__svg__cssinject__ = true
  try{
    document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
  }catch(e){
    console && console.log(e)
  }
}

ready(appendSvg)


})(window)
