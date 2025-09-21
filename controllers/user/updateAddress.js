import Address from "../../models/addressModel.js";

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const customer=req.user._id; // from auth middleware

    const {
      fullName,
      phoneNumber,
      alternatePhoneNumber,
      pincode,
      streetAddress,
      landmark,
      locality,
      city,
      state,
      country,
      addressType,
      isDefault,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !phoneNumber ||
      !pincode ||
      !streetAddress ||
      !locality ||
      !city ||
      !state
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Update address
    const updated = await Address.findByIdAndUpdate(
      id,
      {
        fullName,
        phoneNumber,
        alternatePhoneNumber,
        pincode,
        streetAddress,
        landmark,
        locality,
        city,
        state,
        country,
        addressType,
        isDefault,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Address not found" });
    }

    // Handle default logic
    if (isDefault) {
      await Address.updateMany(
        { customer: updated.customer, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default updateAddress;
