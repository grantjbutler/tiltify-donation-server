const TiltifyClient = require('tiltify-api-client')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const util = require('util')

let client = new TiltifyClient(process.env.TILTIFY_ACCESS_TOKEN)
let interval = process.env.REFRESH_INTERVAL || 5000

let lastSeenDonationID = process.env.LAST_SEEN_DONATION_ID || ''
async function getRecentDonations() {
    try {
        client.Campaigns.getRecentDonations(process.env.CAMPAIGN_ID, (donations) => {
            for (let donation of donations) {
                if (donation.id == lastSeenDonationID) {
                    break
                }

                let overlayDonation = {
                    id: String(donation.id),
                    name: donation.name,
                    amount: donation.amount,
                    date_created: new Date(donation.completedAt)
                }

                if (donation.comment != null) {
                    overlayDonation.comment = donation.comment
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
    } catch (error) {
        setTimeout(() => {
            getRecentDonations()
        }, interval)
    }
}

let campaignTotal = 0.00
let campaignTarget = 0.00
async function getTotal() {
    try {
        await client.Campaigns.get(process.env.CAMPAIGN_ID, (campaign) => {
            if (campaignTotal != campaign.amountRaised) {
                campaignTotal = campaign.amountRaised
                
                io.emit('total', campaignTotal)
                console.log(`> Emitting total: ${campaignTotal}`)
            }

            if (campaignTarget != campaign.fundraiserGoalAmount) {
                campaignTarget = campaign.fundraiserGoalAmount

                io.emit('target', campaignTarget);
                console.log(`> Emitting total: ${campaignTarget}`)
            }

            setTimeout(() => {
                getTotal()
            }, interval)
        })
    } catch (error) {
        setTimeout(() => {
            getTotal()
        }, interval)
    }
}

let port = process.env.PORT || 8081
server.listen(port, () => {
    console.log(`Listening on port ${port}`)

    // if (lastSeenDonationID != '') {
        console.log('delaying fetch of donations for 10 seconds')
        setTimeout(() => {
            getTotal()
            getRecentDonations()
        }, 1000 * 10)
    // }
    // else {
    //     getTotal()
    //     getRecentDonations()
    // }
})