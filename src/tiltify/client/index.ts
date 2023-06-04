import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { z } from "zod";
import { Token, TokenResponseSchema, TokenResponse } from "./../token";
import { TokenStorage } from "./../tokenStorage";
import CampaignClient from "./campaign";

interface TiltifyClientOptions {
    tokenStorage?: TokenStorage;
    clientId: string;
    clientSecret: string;
}

interface TiltifyClientRequest<ResponseSchema extends z.ZodTypeAny> {
    method?: string;
    path: string;
    params?: any;
    data?: any;
    schema: ResponseSchema;
    signal?: AbortSignal;
}

export class TiltifyClient {
    private options: TiltifyClientOptions;
    private token?: Token

    constructor(options: TiltifyClientOptions) {
        this.options = options;
        this.token = options.tokenStorage?.get();
    }

    async authenticate() {
        let requestConfig: AxiosRequestConfig<any> = {
            url: 'https://v5api.tiltify.com/oauth/token',
            method: 'post',
            params: {
                client_id: this.options.clientId,
                client_secret: this.options.clientSecret,
                grant_type: 'client_credentials'
            },
            headers: {},
            transformResponse: [(data: any) => {
                return TokenResponseSchema.parse(JSON.parse(data));
            }]
        };

        if (this.token) {
            if (!this.token.isExpired) {
                return;
            }

            if (this.token.refreshToken) {
                requestConfig.headers!['Authorization'] = 'Bearer ' + this.token.refreshToken;
            }
        }

        let response: AxiosResponse<TokenResponse, any> = await axios(requestConfig);
        let token = Token.fromResponse(response.data);

        this.options.tokenStorage?.store(token);
        this.token = token;
    }

    async send<Value extends z.ZodTypeAny>(request: TiltifyClientRequest<Value>): Promise<z.infer<Value>> {
        if (!this.token || this.token.isExpired) {
            await this.authenticate();
        }

        let response: AxiosResponse<z.infer<Value>, any> = await axios({
            method: request.method,
            url: request.path,
            baseURL: 'https://v5api.tiltify.com/api/public/',
            headers: {
                'Authorization': 'Bearer ' + this.token?.accessToken
            },
            params: request.params,
            data: request.data,
            transformResponse: [
                function(data: any) {
                    return request.schema.parse(JSON.parse(data));
                }
            ],
            signal: request.signal
        });
        return response.data;
    }

    get campaigns(): CampaignClient {
        return new CampaignClient(this);
    }
}