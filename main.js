import './style.css'
import { encode, decode } from 'js-base64'
import Split from 'split-grid'
import * as monaco from 'monaco-editor'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

window.MonacoEnvironment = {
  getWorker (_, label) {
    if (label === 'html') {
      return new HtmlWorker()
    }
    if (label === 'css') {
      return new CssWorker()
    }
    if (label === 'javascript') {
      return new JsWorker()
    }
  }  
} 

const $ = (selector) => document.querySelector(selector)



Split({
  columnGutters: [{
    track: 1,
    element: $('.vertical-gutter')
  }],
  rowGutters: [{
    track: 1,
    element: $('.horizontal-gutter')
  }]
})

const $js = $('#js')
const $css = $('#css')
const $html = $('#html')

const COMMON_EDITOR_OPTIONS = {
  automaticLayout: true,
  fontSize: 18,
  minimap: {
    enabled: false
  },
  theme: 'vs-dark'
}


  const { pathname } = window.location

  const [RawHtml, RawCss, Rawjs ] = pathname.slice(1).split('%7C')
  const html = RawHtml ? decode(RawHtml) : ''
  const css = RawCss ? decode(RawCss) : ''
  const js = Rawjs ? decode(Rawjs) : ''

  const htmlEditor = monaco.editor.create($html, {
    value: html,
    language: 'html',
    ...COMMON_EDITOR_OPTIONS
  })

  const cssEditor = monaco.editor.create($css, {
    value: css,
    language: 'css',
    ...COMMON_EDITOR_OPTIONS
  })

  const jsEditor = monaco.editor.create($js, {
    value: js,
    language: 'javascript',
    ...COMMON_EDITOR_OPTIONS
  })

  htmlEditor.onDidChangeModelContent(update)
  cssEditor.onDidChangeModelContent(update)
  jsEditor.onDidChangeModelContent(update)


  update()




function update () {
  const html = htmlEditor.getValue()
  const css = cssEditor.getValue()
  const js = jsEditor.getValue()



  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`
  window.history.replaceState(null, null, `/${hashedCode}`)



  const htmlForpreview = createHtml({html, css, js})

  $('iframe').setAttribute('srcdoc', htmlForpreview)

}

function createHtml ({html, js, css}) {

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `
}



