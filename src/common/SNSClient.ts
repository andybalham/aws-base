import SNS, { MessageAttributeMap, MessageAttributeValue, PublishInput, PublishResponse } from 'aws-sdk/clients/sns';
import https from 'https';

const agent = new https.Agent({
    keepAlive: true
});

const sns = new SNS({
    httpOptions: {
        agent
    }
});

export default class SNSClient {

    private sns: SNS;

    constructor(private topicName?: string, snsOverride?: SNS) {
        this.sns = snsOverride ?? sns;
    }

    async publishMessage(content: object, attributes?: object): Promise<PublishResponse> {

        if (this.topicName === undefined) throw new Error('this.topicName === undefined');

        const publishInput: PublishInput = {
            Message: JSON.stringify(content),
            TopicArn: this.topicName,
            MessageAttributes: this.getMessageAttributeMap(attributes),
        };
        
        console.log(`publishInput: ${JSON.stringify(publishInput)}`);
        
        const publishResponse = await this.sns.publish(publishInput).promise();

        return publishResponse;
    }

    private getMessageAttributeMap(attributes?: object): MessageAttributeMap | undefined {

        if (!attributes) {
            return undefined;
        }

        const messageAttributeMap = {};

        for (const attributeEntry of Object.entries(attributes)) {
            
            const attributeName = attributeEntry[0];
            const attributeValue = attributeEntry[1];

            let dataType: string;
            switch (typeof attributeValue) {
            case 'string':
                dataType = 'String';
                break;
            case 'number':
                dataType = 'Number';
                break;
            default:
                throw new Error(`Unhandled attribute value type: ${typeof attributeValue}`);
            }

            const messageAttribute: MessageAttributeValue = {
                DataType: dataType,
                StringValue: `${attributeValue}`,
            };

            messageAttributeMap[attributeName] = messageAttribute;
        }

        return messageAttributeMap;
    }
}
