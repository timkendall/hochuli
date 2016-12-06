import nock from 'nock'

export function mockCachedEndpoint(base, endpoint) {
  nock(base)
    .get(endpoint)
    .reply(304)
}

export function mockFreshEndpoint(base, endpoint, data, etag = '1234') {
  nock(base)
    .get(endpoint)
    .reply(200, data, { 'ETag': etag })
}
