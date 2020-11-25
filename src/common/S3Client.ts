import S3, { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';

export default class S3Client {

    constructor(private s3?: S3, private bucket?: string) {}

    async getJsonObject<T>(key: string, bucket?: string): Promise<T> {

        bucket = bucket ?? this.bucket;

        if (this.s3 === undefined) throw new Error('this.s3 === undefined');
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

        bucket = bucket ?? this.bucket;

        if (this.s3 === undefined) throw new Error('this.s3 === undefined');
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

