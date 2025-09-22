import Address from "../../models/addressModel.js";
// Get all addresses of a customer
const getAddresses = async (req, res) => {
  try {
    const { customerId } = req.params;
    const addresses = await Address.find({ customerId });
    res.json(addresses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getDefaultAddress = async (req, res) => {
  try {
    const { id:customerId } = req.params;
    const defaultAddress = await Address.findOne({ customerId, isDefault: true });
    if (!defaultAddress) {
      return res.status(404).json({ message: "Default address not found" });
    } 
    res.json(defaultAddress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




export {getAddresses, getDefaultAddress};