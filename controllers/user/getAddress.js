import Address from "../../models/addressModel.js";
// Get all addresses of a customer
export const getAddresses = async (req, res) => {
  try {
    const { customerId } = req.params;
    const addresses = await Address.find({ customerId });
    res.json(addresses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default getAddresses;