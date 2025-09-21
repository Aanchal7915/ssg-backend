import Address from "../../models/addressModel.js";

// Set an address as default

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    await Address.updateMany(
      { customer: address.customer },
      { $set: { isDefault: false } }
    );

    address.isDefault = true;
    await address.save();

    res.json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default setDefaultAddress;