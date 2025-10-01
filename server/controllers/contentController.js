import Content from "../models/Content.js";

// add product
const addContent = async (req, res) => {
  try {
    const { title, author, category, readData } = req.body;

    if(!title || !author || !category || !readData){
        return res.json({success:false,message:"form info missing"})
    }

    const contentData= new Content({
        title, author, category, readData
    });
    const content=await contentData.save();
    console.log(content);

    res.json({ success: true, message: "Content added successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//list contents
const listContent=async(req,res)=>{
    try {
        const content = await Content.find({});
        res.json({success:true,content})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// remove content
const removeContent=async(req,res)=>{
    const {id}=req.body;
    try {
        if(!id){
            return res.json({success:false,message:"Content id is required"})
        }
        await Content.findByIdAndDelete(id);
        res.json({success:true,message:"Content removed successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// single content
const singleContent=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!id){
            return res.json({success:false,message:"Product id is required"})
        }
        const content= await Content.findById(id);
        if(!content){
            return res.json({success:false,message:"Product not found"})
        }
        res.json({success:true,content})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// update content
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, readData } = req.body;

    const content = await Content.findByIdAndUpdate(
      id,
      { title, author, category, readData },
      { new: true }
    );

    if (!content) {
      return res.json({ success: false, message: "Content not found" });
    }

    res.json({ success: true, message: "Content updated successfully", content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export {addContent,listContent,removeContent,singleContent,updateContent};