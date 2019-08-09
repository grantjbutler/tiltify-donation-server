const TiltifyClient = require('tiltify-api-client')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const util = require('util')

let client = new TiltifyClient(process.env.TILTIFY_ACCESS_TOKEN)
let interval = process.env.REFRESH_INTERVAL || 5000

let lastSeenDonationID = ''
function getRecentDonations() {
    client.Campaigns.getRecentDonations(process.env.CAMPAIGN_ID, (donations) => {
        for (let donation of donations) {
            if (donation.id == lastSeenDonationID) {
                break
            }

            const overlayDonation = {
                id: String(donation.id),
                name: donation.name,
                comment: donation.comment,
                amount: donation.comment,
                date_created: new Date(donation.completedAt)
            }
            io.emit('donation', overlayDonation)
            console.log(`> Emitting donation: ${util.inspect(overlayDonation)}`)
        }
        
        if (donations.length > 0) {
            lastSeenDonationID = String(donations[0].id)
        }

        setTimeout(() => {
            getRecentDonations()
        }, interval)
    })
}

let campaignTotal = 0.00
function getTotal() {
    client.Campaigns.get(process.env.CAMPAIGN_ID, (campaign) => {
        if (campaignTotal != campaign.amountRaised) {
            campaignTotal = campaign.amountRaised
            
            io.emit('total', campaignTotal)
            console.log(`> Emitting total: ${campaignTotal}`)
        }

        setTimeout(() => {
            getTotal()
        }, interval)
    })
}

let port = process.env.PORT || 8081
server.listen(port, () => {
    console.log(`Listening on port ${port}`)

    getTotal()
    getRecentDonations()
})