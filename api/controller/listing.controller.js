import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
export const createListing = async (req, res, next) => {
  //fetch data
  const {
    name,
    description,
    address,
    regularPrice,
    discountPrice,
    offer,
    imageUrls,
    useRef,
  } = req.body;

  try {
    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      offer,
      imageUrls,
      useRef,
    });
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id != listing.useRef) {
    return next(errorHandler(401, "You can delete only your own listing"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id != listing.useRef) {
    return next(errorHandler(401, "You can update only your own listing"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(errror);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
