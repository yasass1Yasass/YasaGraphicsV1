"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary once
const apiSecret = process.env.CLOUDINARY_API_SECRET || "oLEI0o0H7zObFvj069l8d4Zjfd0";
cloudinary.config({
  cloud_name: "dmyp8ajc7",
  api_key: "783971789699552",
  api_secret: apiSecret,
});

// Upload file to Cloudinary
export const uploadFile = action({
  args: {
    fileData: v.string(), // Base64 encoded file data
    fileName: v.string(),
    fileType: v.string(), // MIME type
    folder: v.optional(v.string()), // Optional folder in Cloudinary
    token: v.string(), // Admin token for auth
  },
  handler: async (_ctx, args) => {
    
    // Simple token check (in production, use proper auth)
    if (!args.token || args.token.length < 10) {
      throw new Error("Unauthorized");
    }

    try {
      // Determine resource type based on MIME type
      const resourceType = args.fileType.startsWith("video/") ? "video" : "image";
      
      // Upload options
      const uploadOptions: any = {
        resource_type: resourceType,
        folder: args.folder || "yasagraphics",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      };

      // For videos, add additional options
      if (resourceType === "video") {
        uploadOptions.eager = [
          { width: 800, height: 600, crop: "limit" },
        ];
        uploadOptions.eager_async = false;
      } else {
        // For images, add transformation options
        uploadOptions.transformation = [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto" },
        ];
      }

      // Upload to Cloudinary - need to prepend data URL format
      const dataUri = `data:${args.fileType};base64,${args.fileData}`;
      const result = await cloudinary.uploader.upload(
        dataUri,
        uploadOptions
      );

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
      };
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  },
});

// Delete file from Cloudinary
export const deleteFile = action({
  args: {
    publicId: v.string(),
    resourceType: v.optional(v.string()), // "image" or "video"
    token: v.string(),
  },
  handler: async (_ctx, args) => {
    // Simple token check
    if (!args.token || args.token.length < 10) {
      throw new Error("Unauthorized");
    }

    try {
      const result = await cloudinary.uploader.destroy(
        args.publicId,
        {
          resource_type: args.resourceType || "image",
        }
      );

      return {
        success: result.result === "ok",
        result: result.result,
      };
    } catch (error: any) {
      console.error("Cloudinary delete error:", error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },
});

