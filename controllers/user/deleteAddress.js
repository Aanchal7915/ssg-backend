import Address from "../../models/addressModel.js";
// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.findByIdAndDelete(id);
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default deleteAddress;
