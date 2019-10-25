# tiltify-donation-server

`tiltify-donation-server` is a server that vends Tiltify events over Socket.IO. It polls Tiltify for new donations and an updated total, and emits events when new data is available.

## Events

### `total`

```json
1234.56
```

### `donation`

```json
{
  "id": "12345",
  "name": "Jane Doe",
  "amount": 12.34,
  "date_created": "",
  "comment": "Optional comment"
}
```

## Environment Variables

`TILTIFY_ACCESS_TOKEN` - An access token for accessing your Tiltify campaign.

`CAMPAIGN_ID` - The ID for your Tiltify campaign.

`REFRESH_INTERVAL` - The number of milliseconds to use as the interval for pinging Tiltify. Defaults to `5000`.

`LAST_SEEN_DONATION_ID` - The identifier of the last donation that was seen by the server. Provide this value for cases where you need to stop and restart the server, to avoid fetching old donations. Optional. 
