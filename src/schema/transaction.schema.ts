import * as mongoose from "mongoose";

interface transactionInterface {
    userId:mongoose.Types.ObjectId;
    ticketId:mongoose.Types.ObjectId;
    previousBalance:number;
    closingBalance:number;
}

class transactionBody{
    userId:mongoose.Types.ObjectId;
    ticketId:mongoose.Types.ObjectId;
    previousBalance:number;
    closingBalance:number;
}

const transactionSchema= new mongoose.Schema<transactionInterface>({
    userId:{type: mongoose.Types.ObjectId, required: true},
    ticketId:{type: mongoose.Types.ObjectId, required:true},
    previousBalance:{type: Number, required: true},
    closingBalance:{type: Number, required: true}
},{timestamps:true});


export default transactionSchema;
export {transactionInterface,transactionBody};