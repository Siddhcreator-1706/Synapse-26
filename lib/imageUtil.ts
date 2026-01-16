import { supabaseServer } from "./supabaseServer";

type UploadImageParams = {
    file: File;
    bucket: string;
    folder?: string;
};

export async function uploadImage({
    file,
    bucket,
    folder = "uploads",
}: UploadImageParams) {
    if (!file) throw new Error("No file provided");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabaseServer.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
        });

    if (error) {
        throw new Error(error.message);
    }

    const { data } = supabaseServer.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return {
        path: filePath,
        publicUrl: data.publicUrl,
    };
}

type EditImageParams = {
    file: File;
    bucket: string;
    oldFilePath: string;
    folder?: string;
};

export async function editImage({
    file,
    bucket,
    oldFilePath,
    folder = "uploads",
}: EditImageParams) {
    if (!file) throw new Error("No file provided");

    // Delete the old image first
    const { error: deleteError } = await supabaseServer.storage
        .from(bucket)
        .remove([oldFilePath]);

    if (deleteError) {
        throw new Error(`Failed to delete old image: ${deleteError.message}`);
    }

    // Upload the new image
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabaseServer.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
        });

    if (uploadError) {
        throw new Error(`Failed to upload new image: ${uploadError.message}`);
    }

    const { data } = supabaseServer.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return {
        path: filePath,
        publicUrl: data.publicUrl,
    };
}

type DeleteImageParams = {
    bucket: string;
    filePath: string;
};

export async function deleteImage({ bucket, filePath }: DeleteImageParams) {
    if (!filePath) throw new Error("No file path provided");

    const { error } = await supabaseServer.storage
        .from(bucket)
        .remove([filePath]);

    if (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
    }

    return {
        success: true,
        message: "Image deleted successfully",
    };
}
