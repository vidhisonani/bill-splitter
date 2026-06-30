const Group = require("../models/Group");
const User = require("../models/User");

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" })
    }
    const group = await Group.create({ name, description, createdBy: req.user._id, members: [req.user._id] });
    return res.status(201).json({ message: "Group Created", group });
  } catch (err) {
    console.log("Error while creating group: ", err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
    return res.status(200).json({ message: "Group Fetched", groups });

  } catch (err) {
    console.log("Error while fetching group: ", err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId)
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.status(200).json({ message: "Group Fetched", group });
  } catch (err) {
    console.log("Error while fetchibg group", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.addMember = async (req, res) => {
  try{
    const {email} = req.body;
    const groupId = req.params.id; 
    const group = await Group.findById(groupId);
    if(!group){
      return res.status(404).json({message: "Group not found"});
    }
    const member = await User.findOne({email});
    if(!member){
      return res.status(404).json({message: "Member not found"});
    }
    if(group.members.includes(member._id)){
      return res.status(400).json({message: "Member already exists in group"});
    }
    group.members.push(member._id);
    await group.save();
    const updatedGroup = await Group.findById(group._id)
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
    return res.status(200).json({ message: "Member added successfully", group: updatedGroup });
  } catch (err) {
    console.log("Error while adding a member", err);
    return res.status(500).json({ message: "Internal Server Error" })
  }
}