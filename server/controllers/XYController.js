import Donor from '../models/donorModel.js';
import Receiver from '../models/receiverModel.js';

// Create a new donation item [puts in both itemlist and donationlist of donor] [notifying the receivers]


export const getAllXY = async (req, res) => {
    try{
        const donors = await Donor.find({}, { _id: 0, x: 1, y: 1 });
        const receiver = await Receiver.find({}, { _id: 0, x: 1, y: 1 });
        res.status(200).json({
            success: true,
            donors:donors,
            receiver:receiver
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Failed to get Locations',
            error: error.message
        });
    }
};

export default {
    getAllXY
}; 