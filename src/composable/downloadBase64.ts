import type { Ref } from 'vue'
import _ from 'lodash'

export {
  getMimeTypeFromBase64,
  previewImageFromBase64,
  useDownloadFileFromBase64,
  useDownloadFileFromBase64Refs,
}

const commonMimeTypesSignatures = {
  'JVBERi0': 'application/pdf',
  'R0lGODdh': 'image/gif',
  'R0lGODlh': 'image/gif',
  'iVBORw0KGgo': 'image/png',
  '/9j/': 'image/jpg',
}

function getMimeTypeFromBase64({ base64String }: { base64String: string }) {
  const [,mimeTypeFromBase64] = base64String.match(/data:(.*?);base64/i) ?? []

  if (mimeTypeFromBase64) {
    return { mimeType: mimeTypeFromBase64 }
  }

  const inferredMimeType = _.find(commonMimeTypesSignatures, (_mimeType, signature) => base64String.startsWith(signature))

  if (inferredMimeType) {
    return { mimeType: inferredMimeType }
  }

  return { mimeType: undefined }
}

function downloadFromBase64({ sourceValue, filename, extension, fileMimeType }:
{ sourceValue: string, filename?: string, extension?: string, fileMimeType?: string }) {
  if (sourceValue === '') {
    throw new Error('Base64 string is empty')
  }

  const { mimeType } = getMimeTypeFromBase64({ base64String: sourceValue })

  const a = document.createElement('a')
  a.click()
}

function useDownloadFileFromBase64(
  { source, filename, extension, fileMimeType }:
  { source: Ref<string>, filename?: string, extension?: string, fileMimeType?: string },
) {
  return {
    download() {
      downloadFromBase64({ sourceValue: source.value, filename, extension, fileMimeType })
    },
  }
}

function useDownloadFileFromBase64Refs(
  { source, filename, extension }:
  { source: Ref<string>, filename?: Ref<string>, extension?: Ref<string> },
) {
  return {
    download() {
      downloadFromBase64({ sourceValue: source.value, filename: filename?.value, extension: extension?.value })
    },
  }
}

function previewImageFromBase64(base64String: string): HTMLImageElement {
  if (base64String === '') {
    throw new Error('Base64 string is empty')
  }

  const img = document.createElement('img')
  img.src = base64String

  const container = document.createElement('div')
  container.appendChild(img)

  const previewContainer = document.getElementById('previewContainer')
  if (previewContainer) {
    previewContainer.innerHTML = ''
    previewContainer.appendChild(container)
  }
  else {
    throw new Error('Preview container element not found')
  }

  return img
}
