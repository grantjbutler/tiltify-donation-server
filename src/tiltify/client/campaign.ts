import { TiltifyClient } from ".";
import { Campaign, CampaignSchema } from "../models/campaign";
import { Cursor } from "../models/cursor";
import { Reward, RewardSchema } from "../models/reward";
import { DataResponse, makeDataResponseSchema, PaginatedResponse, makePaginatedResponseSchema } from "./responses";

export default class CampaignClient {
    private client: TiltifyClient
    
    constructor(client: TiltifyClient) {
        this.client = client;
    }

    async bySlug(userSlug: string, campaignSlug: string): Promise<DataResponse<Campaign>> {
        return await this.client.send({
            path: `campaigns/by/slugs/${userSlug}/${campaignSlug}`,
            schema: makeDataResponseSchema(CampaignSchema)
        })
    }

    async rewards(campaignId: string, cursor?: Cursor): Promise<PaginatedResponse<Reward>> {
        return await this.client.send({
            path: `campaigns/${campaignId}/rewards`,
            params: cursor,
            schema: makePaginatedResponseSchema(RewardSchema)
        });
    }
}