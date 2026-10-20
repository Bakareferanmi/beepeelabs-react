const ROOT = 'https://firestore.googleapis.com/v1/projects/beepeelabs/databases/(default)/documents'

function decode(value) {
  if ('stringValue' in value) return value.stringValue
  if ('timestampValue' in value) return value.timestampValue
  if ('booleanValue' in value) return value.booleanValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return value.doubleValue
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decode)
  if ('mapValue' in value) return fields(value.mapValue.fields || {})
  return null
}

const fields = (data) => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, decode(value)]))
const documentData = (document) => ({ ...fields(document.fields || {}), id: document.name.split('/').pop() })

async function request(path) {
  const response = await fetch(ROOT + path, { signal: AbortSignal.timeout(10000) })
  if (response.status === 404) return null
  if (!response.ok) throw new Error('Content service returned HTTP ' + response.status)
  return response.json()
}

export async function getDocument(collection, id) {
  const data = await request('/' + collection + '/' + encodeURIComponent(id))
  return data ? documentData(data) : null
}

export async function listDocuments(collection) {
  const documents = []
  let token = ''
  do {
    const data = await request('/' + collection + '?pageSize=300' + (token ? '&pageToken=' + encodeURIComponent(token) : ''))
    if (!data) throw new Error('Content collection is unavailable')
    documents.push(...(data.documents || []).map(documentData))
    token = data.nextPageToken || ''
  } while (token)
  return documents
}
