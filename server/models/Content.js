import mongoose from 'mongoose'

const contentSchema=new mongoose.Schema({
        title:{
            type:String,
            required:true
        },
        author:{
            type:String,
            required:true
        },
        readData:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        }
        
    },{ timestamps: true }
)
    
    
const Content = mongoose.models.content || mongoose.model("Content",contentSchema);
    
export default Content;