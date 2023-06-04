import test from 'ava';
import { verifySignature } from '../../src/tiltify/webhooks/verification';
import { setNow } from '../../src/util/now';

test('verifies webhook message', t => {
    setNow(() => 1681836540000); // Tue Apr 18 2023 16:49:00 GMT+0000

    const secret = '13c3b68914487acd1c68d85857ee1cfc308f15510f2d8e71273ee0f8a42d9d00';
    const timestamp = '2023-04-18T16:49:00.617031Z';
    const body = `{"data":{"amount":{"currency":"USD","value":"82.95"},"campaign_id":"a4fd5207-bd9f-4712-920a-85f8d92cf4e6","completed_at":"2023-04-18T16:48:26.510702Z","created_at":"2023-04-18T03:36:36.510717Z","donor_comment":"Rerum quo necessitatibus voluptas provident ad molestiae ipsam.","donor_name":"Jirachi","fundraising_event_id":null,"id":"dfa25dcc-2026-4320-a5b7-5da076efeb05","legacy_id":0,"poll_id":null,"poll_option_id":null,"reward_id":null,"sustained":false,"target_id":null,"team_event_id":null},"meta":{"attempted_at":"2023-04-18T16:49:00.617031Z","event_type":"public:direct:donation_updated","generated_at":"2023-04-18T16:48:59.510758Z","id":"d8768e26-1092-4f4c-a829-a2698cd19664","subscription_source_id":"00000000-0000-0000-0000-000000000000","subscription_source_type":"test"}}`;
    const signature = '4OSwlhTt0EcrlSQFlqgE18FOtT+EKX4qTJdJeC8oV/o=';

    t.true(verifySignature(secret, signature, timestamp, body));
});

test('does not verify webhook message if too old', t => {
    setNow(() => 2681836540000); // Fri Dec 25 2054 18:35:40 GMT+0000

    const secret = '13c3b68914487acd1c68d85857ee1cfc308f15510f2d8e71273ee0f8a42d9d00';
    const timestamp = '2023-04-18T16:49:00.617031Z';
    const body = `{"data":{"amount":{"currency":"USD","value":"82.95"},"campaign_id":"a4fd5207-bd9f-4712-920a-85f8d92cf4e6","completed_at":"2023-04-18T16:48:26.510702Z","created_at":"2023-04-18T03:36:36.510717Z","donor_comment":"Rerum quo necessitatibus voluptas provident ad molestiae ipsam.","donor_name":"Jirachi","fundraising_event_id":null,"id":"dfa25dcc-2026-4320-a5b7-5da076efeb05","legacy_id":0,"poll_id":null,"poll_option_id":null,"reward_id":null,"sustained":false,"target_id":null,"team_event_id":null},"meta":{"attempted_at":"2023-04-18T16:49:00.617031Z","event_type":"public:direct:donation_updated","generated_at":"2023-04-18T16:48:59.510758Z","id":"d8768e26-1092-4f4c-a829-a2698cd19664","subscription_source_id":"00000000-0000-0000-0000-000000000000","subscription_source_type":"test"}}`;
    const signature = '4OSwlhTt0EcrlSQFlqgE18FOtT+EKX4qTJdJeC8oV/o=';

    t.false(verifySignature(secret, signature, timestamp, body));
});