import * as rp from 'request-promise';

export class KafkaClient {
    kafkaRestUrl: string;

    constructor(kafkaRestUrl: string) {
        this.kafkaRestUrl = kafkaRestUrl;
    }

    getTopics(): Thenable<string[]> {
        return rp.get(this.kafkaRestUrl + '/topics', {
            'Accept': 'application/json'
        }).then((body: string) => {            
            return JSON.parse(body);
        }).catch((err) => {
            return console.log(err);            
        });
    }
}