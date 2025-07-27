interface ITaskJson {
    id: number;
    entered_id: string;
    stage: string;
    recieved?: Date;
    finished?: Date;
    quantity?: number;
}

class Task {
    id: number;
    enetered_id: string;
    stage: string;
    recieved?: Date;
    finished?: Date;
    quantity?: number;

    constructor(taskJson: ITaskJson) {
        this.id = taskJson.id;
        this.enetered_id = taskJson.entered_id;
        this.stage = taskJson.stage;
        this.recieved = taskJson.recieved;
        this.finished = taskJson.finished;
        this.quantity = taskJson.quantity;
    }

    toJson() {
        return {
            id: this.id,
            entered_id: this.enetered_id,
            stage: this.stage,
            recieved: this.recieved,
            finished: this.finished,
            quantity: this.quantity,
        }
    }
}

export default Task