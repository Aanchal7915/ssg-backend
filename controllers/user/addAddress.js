import Address from "../../models/addressModel.js";

export const addAddress = async (req, res) => {
  try {
    const customer = req.user._id; // from auth middleware

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
      country="India",
      addressType,
      isDefault,
    } = req.body;

    // Basic validation
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

    // Create address object
    const address = new Address({
      customer,
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
    });

    // Handle default address logic
    if (isDefault) {
      await Address.updateMany({ customer }, { $set: { isDefault: false } });
    }

    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export default addAddress;