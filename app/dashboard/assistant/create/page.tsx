"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useSupabase } from "@/hooks/use-supabase";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAssistantSchema,
  CreateAssistantInput,
} from "@/lib/validations/assistant";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadService } from "@/lib/supabase/upload";
import { useOpenAI } from "@/hooks/use-openai";

export default function page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { insert } = useSupabase<any>("assistants");
  const { uploadFiles } = uploadService();
  const {
    uploadToOpenAI,
    createVectorStore,
    updateVectorStore,
    createAssistant,
  } = useOpenAI();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    register,
  } = useForm<CreateAssistantInput>({
    resolver: zodResolver(createAssistantSchema),
    defaultValues: {
      name: "",
      model: "",
      instructions: "",
      temperature: 0.7,
      files: [],
    },
  });

  // Handle file upload
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);

      // Update form with file metadata
      setValue(
        "files",
        acceptedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      );
    },
    [setValue]
  );

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/json": [".json"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/assistant", label: "Assistants" },
    { label: "New Assistant", isCurrentPage: true },
  ];

  const handleFormSubmit = async (formData: CreateAssistantInput) => {
    setLoading(true);
    try {
      if (uploadedFiles.length > 0) {
        // Upload files to Supabase
        const fileUrls = await uploadFiles(uploadedFiles);
        console.log("File successfully uploaded to OpenAI", fileUrls);
        // Upload files to OpenAI
        let fileIds: string[] = [];
        if (fileUrls.success && fileUrls.data) {
          // Loop through fileUrls and then upload to OpenAI
          for (const fileUrl of fileUrls.data) {
            const fileId = await uploadToOpenAI({
              file_url: fileUrl.url,
              file_name: fileUrl.filename,
              file_type: fileUrl.type,
            });
            if (fileId) {
              console.log("fileId", fileId);
              fileIds.push(fileId);
            }
          }
          // Create vector store
          const vectorId = await createVectorStore({
            name: formData.name,
            file_ids: fileIds,
          });
          console.log("Vector is successfully created", vectorId);
          // Add files to vector store
          if (vectorId) {
            // Create assistant with vector store
            const assistant = await createAssistant({
              name: formData.name,
              model: formData.model,
              vector_store_id: vectorId,
              instructions: formData.instructions,
            });
            console.log("Assistant is successfully created", assistant);
          }
        }
      }
      // Handle successful creation (e.g., show a success message, redirect)
      // router.push("/dashboard/assistant");
    } catch (error) {
      console.error("Error creating assistant:", error);
      // Handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  const getFilePreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Add cleanup for object URLs on component unmount
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      uploadedFiles.forEach((file) => {
        URL.revokeObjectURL(getFilePreviewUrl(file));
      });
    };
  }, [uploadedFiles]);
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="container max-w-2xl px-4 pt-4 pb-20 mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create New Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure your new AI assistant with custom instructions and
              parameters.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6 pt-6"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm">Assistant Name</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter a name for your assistant"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                This is how you'll identify your assistant.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm">Model</label>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4-turbo-preview">
                        GPT-4 Turbo
                      </SelectItem>
                      <SelectItem value="gpt-3.5-turbo">
                        GPT-3.5 Turbo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.model && (
                <p className="text-red-500">{errors.model.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Select the AI model that powers your assistant.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm">Instructions</label>

              <Controller
                name="instructions"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Enter detailed instructions for your assistant..."
                    className="min-h-[150px]"
                  />
                )}
              />
              {errors.instructions && (
                <p className="text-red-500">{errors.instructions.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Provide clear instructions about how the assistant should behave
                and respond.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm">
                Temperature: {getValues("temperature")}
              </label>

              <Controller
                name="temperature"
                control={control}
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                )}
              />
              {errors.temperature && (
                <p className="text-red-500">{errors.temperature.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Adjust creativity level (0 = more focused, 1 = more creative)
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Upload Files (optional)</label>

              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg px-6 py-10 cursor-pointer",
                  "hover:border-primary/50 transition-colors",
                  isDragActive && "border-primary bg-primary/5"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    Drag & drop or click to select files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    pdf, txt, md, json (max 20mb)
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload files to train your assistant with custom knowledge.
              </p>
              {errors.files && (
                <p className="text-red-500">{errors.files.message}</p>
              )}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <a
                        href={getFilePreviewUrl(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm truncate text-primary hover:underline"
                      >
                        {file.name}
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          URL.revokeObjectURL(getFilePreviewUrl(file));
                          setUploadedFiles(
                            uploadedFiles.filter((f) => f !== file)
                          );
                          const currentFiles = getValues("files") || [];
                          setValue(
                            "files",
                            currentFiles.filter((f) => f.name !== file.name)
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving.." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
