class MyRequest {
    input: string;    
}

class MyResponse {
    output: string;    
}

export const handle = async (event: MyRequest): Promise<MyResponse> => {
    return {
        output: event.input
    };
};