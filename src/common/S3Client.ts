import S3, { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';
import https from 'https';

const agent = new https.Agent({
    keepAlive: true
});

const s3 = new S3({
    httpOptions: {
        agent
    }
});

export default class S3Client {

    private s3: S3;

    constructor(public bucketName?: string, s3Override?: S3) {
        this.s3 = s3Override ?? s3;
    }

    async getJsonObject<T>(key: string, bucket?: string): Promise<T> {

        bucket = bucket ?? this.bucketName;

        if (bucket === undefined) throw new Error('bucket === undefined');

        const getObjectRequest: GetObjectRequest = {
            Bucket: bucket,
            Key: key,
        };

        try {
            const getObjectOutput = await this.s3.getObject(getObjectRequest).promise();

            if (getObjectOutput.Body === undefined) {
                throw new Error(`GetObjectOutput.Body is undefined: ${JSON.stringify(getObjectRequest)}`);
            }
    
            const obj = JSON.parse(getObjectOutput.Body.toString('utf-8'));
            return obj;

        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'NoSuchKey') {
                    const newError = new Error(`The specified key does not exist: ${key}, bucket: ${bucket}`);
                    newError.name = error.name;
                    throw newError;
                }
            }
            throw error;
        }
    }

    async putJsonObject(key: string, obj: any, bucket?: string): Promise<void> {

        bucket = bucket ?? this.bucketName;

        if (bucket === undefined) throw new Error('bucket === undefined');

        const putObjectRequest: PutObjectRequest = {
            Bucket: bucket,
            Key: key,
            Body: JSON.stringify(obj),
            ContentType: 'application/json; charset=utf-8',
        };

        await this.s3.putObject(putObjectRequest).promise();
    }
}

